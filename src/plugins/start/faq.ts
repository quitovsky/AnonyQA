import { BotContext } from "@anonyqa/types";
import { CommandContext, InputMediaBuilder } from "grammy";
import dedent from "ts-dedent";

export async function faq(ctx: CommandContext<BotContext>) {
    await ctx.replyWithMediaGroup([InputMediaBuilder.photo("https://www.aosumi.ru/files/anonyqa_faq1.png", {
        caption: dedent`
        в связи с <i>ограничениями</i> телеграма, для создания вопроса надо выполнить <b>одно из условий</b>:

        – отправлять сообщение <b><i>от своего имени</i></b>, а не от имени канала (скрин 1)
        – <b>выключить</b> в настройках канала <i>подписывание сообщений</i> (скрин 2)
        `,
        parse_mode: "HTML"
    }), InputMediaBuilder.photo("https://www.aosumi.ru/files/anonyqa_faq2.png")])
    return;
}