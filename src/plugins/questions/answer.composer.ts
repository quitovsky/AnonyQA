import { prisma } from "@anonyqa/shared";
import { BotContext } from "@anonyqa/types";
import { Conversation, createConversation } from "@grammyjs/conversations";
import { Composer } from "grammy";
import dedent from "ts-dedent";

const composer = new Composer<BotContext>()

async function answer(conversation: Conversation, ctx: BotContext, questionId: string) {
    await ctx.reply(dedent`
        💭 Напиши свой ответ
        `)
    let text = null;
    while (!text) {
        const { message } = await conversation.waitFor("message");
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
            text = message.text
        }
    }
    const question = await prisma.question.findUnique({
        where: {
            nanoid: questionId
        },
        include: {
            author: true
        }
    })
    if (!question) return ctx.reply("что-то пошло не так... 😢");

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

        ❓: ${question.question}
        💌: ${answer.answer}
        `);
    } catch { /**/ }
    
    await ctx.reply(`ответ отправлен!`)


    return
}

composer.use(createConversation(answer, {
    id: "handle-answer",
}))


export const AnswerComposer = composer;