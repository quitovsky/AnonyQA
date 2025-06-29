import { ADMIN_ID } from './../../main';
import { prisma } from "@anonyqa/shared";
import { BotContext } from "@anonyqa/types";
import { Conversation, createConversation } from "@grammyjs/conversations";
import { Composer, InlineKeyboard } from "grammy";
import dedent from "ts-dedent";

const composer = new Composer<BotContext>()

async function answer(conversation: Conversation, ctx: BotContext, _questionId: string) {
    const checkpoint = await conversation.checkpoint()
    let questionId = _questionId;
    const question = await prisma.question.findUnique({
        where: {
            nanoid: questionId
        },
        include: {
            author: true
        }
    })
    if (!question) return ctx.reply("что-то пошло не так... 😢");
    if (question.author.telegramId === ctx.from.id.toString()) return await ctx.reply("нельзя отвечать на свой вопрос 🥹")
    const query = await ctx.reply(dedent`
        💭 напиши свой ответ

        ❓: ${question.question}
        `, {
        reply_markup: new InlineKeyboard().text("⨯ отменить", "cancel-answer")
    })
    let text = null;
    while (!text) {
        const { message, callbackQuery } = await conversation.waitFor(["message", "callback_query"]);
        if (callbackQuery?.data && callbackQuery.data === "cancel-answer") {
            await ctx.api.deleteMessage(ctx.chatId, callbackQuery.message.message_id)
            return;
        }
        if (!message.text) {
            await ctx.reply(dedent`
                бот на данный момент принимает только <i>текстовые ответы</i> 😢

                следи за обновлениями <b><a href="https://t.me/wannadisappearr">в канале</a></b>, а пока напиши свой ответ:
                `, {
                parse_mode: "HTML",
                link_preview_options: {
                    is_disabled: true
                }
            })
        } else {
            if (message.text.startsWith("/start")) {
                questionId = message.text.substring(11);
                if (!questionId || questionId.length !== 21) return;

                const _question = await prisma.question.findUnique({
                    where: { nanoid: questionId }
                })
                if (!_question) {
                    ctx.reply(`Что-то пошло не так. Вопрос не найден. 😢`)
                    return;
                }
                await conversation.rewind(checkpoint)
            }
            const msg = await ctx.reply(dedent`
                ❓: ${question.question}
                📤: ${message.text}
                `, {
                reply_markup: new InlineKeyboard()
                    .text("✍🏻 изменить", "change")
                    .text("✔️ отправить", "send")
            })

            let choice = "";
            
            while(choice === "") {
                const cb = await conversation.waitFor(["message", "callback_query"]);
                if(!cb.callbackQuery?.data && !cb.message.from.is_bot) {
                    await ctx.api.deleteMessage(cb.chatId, cb.message.message_id)
                }
                else if(cb.callbackQuery?.data === "change" || cb.callbackQuery?.data === "send") {
                    choice = cb.callbackQuery.data
                }
            }

            if (choice === "change") {
                await ctx.api.deleteMessage(msg.chat.id, msg.message_id)
                text = null
            } else if (choice === "send") {
                await ctx.api.deleteMessage(msg.chat.id, msg.message_id)
                text = message.text;
            }
        }
        await ctx.api.deleteMessage(ctx.chatId, message.message_id)
    }

    const answer = await prisma.answer.create({
        data: {
            answer: text,
            question: {
                connect: {
                    id: question.id
                }
            },
            sender: {
                connectOrCreate: {
                    create: {
                        telegramId: ctx.from.id.toString()
                    },
                    where: {
                        telegramId: ctx.from.id.toString()
                    }
                }
            }
        }
    })
    if (!answer) return ctx.reply("что-то пошло не так... 😢");

    try {
        await ctx.api.sendMessage(question.author.telegramId, dedent`
        ★ анонимный ответ на вопрос

        ❓: <i>${question.question}</i>
        💌: <b>${answer.answer}</b>
        `, {
            parse_mode: "HTML"
        });
    } catch { /**/ }

    await ctx.reply(dedent`
        ★ ответ отправлен!

        ❓: <i>${question.question}</i>
        💌: <b>${answer.answer}</b>
        `, {
        parse_mode: "HTML"
    })

    // !DEBUG
    try {
        await ctx.api.sendMessage(ADMIN_ID, dedent`
            👁️‍🗨️ новый ответ
            <tg-spoiler>
            ❓: ${question.question}
            💌: ${answer.answer}

            👤: <a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a>${ctx.from.username ? ` (@${ctx.from.username})` : ""}

            ${answer.createdAt.toLocaleString("ru-RU")}

            #q${question.nanoid}
            #a${answer.id}
            </tg-spoiler>
            `, {
            parse_mode: "HTML"
        })
    } catch (e) {
        console.error(e)
    }

    await ctx.deleteMessage();
    await ctx.api.deleteMessage(ctx.chatId, query.message_id);

    return
}

composer.use(createConversation(answer, {
    id: "handle-answer",
}))

composer.callbackQuery("cancel-answer", async ctx => {
    await ctx.deleteMessage();
    await ctx.conversation.exitAll()
    return;
})


export const AnswerComposer = composer;