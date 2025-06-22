import { prisma } from '@anonyqa/shared';
import { BotContext } from '@anonyqa/types';
import {
    BotError,
    Composer,
    GrammyError,
    InlineKeyboard,
    InlineQueryResultBuilder,
} from 'grammy';
import { nanoid } from 'nanoid';
import dedent from 'ts-dedent';

const composer = new Composer<BotContext>();

composer.on('inline_query', async (ctx) => {
    try {
        const chat = await ctx.api.sendChatAction(ctx.from.id, "find_location");
        console.log(chat)
    } catch (err) {
        return await ctx.answerInlineQuery([], {
            button: { text: "нажми, чтобы начать ^_^", start_parameter: "start" }
        })
    }
    const query = ctx.inlineQuery.query;
    if (!query) return;
    const id = nanoid();
    const result = InlineQueryResultBuilder.article(
        `publish:${id}`,
        'Опубликовать вопрос',
        {
            reply_markup: new InlineKeyboard().url(
                'ответить анонимно',
                `https://t.me/anonyqabot?start=anon${id}`
            ),
            description: ctx.inlineQuery.query,
        }
    ).text('', {
        parse_mode: 'HTML',
        message_text: dedent`
        ❓ анонимный опрос

        ${query}
        `,
    });
    await ctx.answerInlineQuery([result], { cache_time: 0 });
});

composer.on("chosen_inline_result", async ctx => {
    const { result_id, query } = ctx.chosenInlineResult;
    try {
        await prisma.question.create({
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
    }
    catch {
        ctx.editMessageText("😢 произошла ошибка при создании вопроса. попробуйте ещё раз позже")
    }
})

export const QuestionsComposer = composer;
