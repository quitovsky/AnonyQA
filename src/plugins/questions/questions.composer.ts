import { prisma } from '@anonyqa/shared';
import { BotContext } from '@anonyqa/types';
import {
    Composer,
    InlineKeyboard,
    InlineQueryResultBuilder,
} from 'grammy';
import { nanoid } from 'nanoid';
import { ADMIN_ID } from '../../main';
import dedent from 'ts-dedent';

const composer = new Composer<BotContext>();

composer.on('inline_query', async (ctx) => {
    try {
        await ctx.api.sendChatAction(ctx.from.id, "find_location");
    } catch (err) {
        return await ctx.answerInlineQuery([], {
            button: { text: "нажми, чтобы начать ^_^", start_parameter: "start" },
            is_personal: true 
        })
    }
    const query = ctx.inlineQuery.query;
    if (!query) return;
    const id = nanoid();
    const result = InlineQueryResultBuilder.article(
        `publish:${id}`,
        `❓ ${ctx.inlineQuery.query}`,
        {
            reply_markup: new InlineKeyboard().url(
                'как использовать бота',
                'https://t.me/anonyqabot?start=faq'
            ),
            description: `если в канале включено подпсывание сообщений, убедись, что сообщение отправляется не от имени канала`,
        }
    ).text('', {
        parse_mode: 'HTML',
        message_text: dedent`
        ❗️ для работы бота необходимо публиковать вопрос от своего имени
        `
    });
    await ctx.answerInlineQuery([result], { cache_time: 0 });
});

composer.on("chosen_inline_result", async ctx => {
    const { result_id, query } = ctx.chosenInlineResult;
    await ctx.editMessageText(dedent`
        ❓ анонимный вопрос
        
        ${query}
        `, {
            reply_markup: new InlineKeyboard()
                .url(
                    `ответить анонимно`,
                    `https://t.me/anonyqabot?start=anon${result_id.substring(8)}`
                )
        })
    try {
        const q = await prisma.question.create({
            data: {
                nanoid: result_id.substring(8),
                question: query,
                author: {
                    connectOrCreate: {
                        where: {
                            telegramId: ctx.from.id.toString()
                        },
                        create: {
                            telegramId: ctx.from.id.toString()
                        }
                    }
                }
            }
        })

        // !DEBUG
        try {
            await ctx.api.sendMessage(ADMIN_ID, dedent`
            👁️‍🗨️ новый вопрос
            <tg-spoiler>
            ❓: ${q.question}
            👤: <a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a>${ctx.from.username ? ` (@${ctx.from.username})` : ""}

            ${q.createdAt.toLocaleString("ru-RU")}
            #q${q.nanoid}
            </tg-spoiler>
            `, {
                parse_mode: "HTML"
            })
        } catch (e) {
            console.error(e)
        }
    }
    catch (err) {
        console.error(err)
        await ctx.editMessageText("😢 произошла ошибка при создании вопроса. попробуйте ещё раз позже")
    }
})

export const QuestionsComposer = composer;
