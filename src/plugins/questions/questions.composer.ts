import {
    Composer,
    Context,
    InlineKeyboard,
    InlineQueryResultBuilder,
} from 'grammy';

const composer = new Composer<Context>();

composer.on('inline_query', async (ctx) => {
    const query = ctx.inlineQuery.query;
    if (!query) return;
    const result = InlineQueryResultBuilder.article(
        'id:publish-question',
        'Опубликовать вопрос',
        {
            reply_markup: new InlineKeyboard().url(
                'ответить анонимно',
                'https://grammy.dev/'
            ),
            description: ctx.inlineQuery.query,
        }
    ).text('', {
        parse_mode: 'HTML',
        message_text: `<b>grammY</b> is the best way to create your own Telegram bots.
They even have a pretty website! 👇`,
    });
    await ctx.answerInlineQuery([result], { cache_time: 0 });
});

export const QuestionsComposer = composer;
