import {
    Composer,
    Context,
    InlineKeyboard,
    InlineQueryResultBuilder,
} from 'grammy';
import { nanoid } from 'nanoid';
import dedent from 'ts-dedent';

const composer = new Composer<Context>();

composer.on('inline_query', async (ctx) => {
    const query = ctx.inlineQuery.query;
    if (!query) return;
    const id = nanoid();

    const result = InlineQueryResultBuilder.article(
        'id:publish-question',
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
        ❓ Анонимный опрос

        ${query}
        `,
    });
    await ctx.answerInlineQuery([result], { cache_time: 0 });
});

export const QuestionsComposer = composer;
