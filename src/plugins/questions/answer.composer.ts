import { BotContext } from "@anonyqa/types";
import { Conversation } from "@grammyjs/conversations";
import { Composer } from "grammy";
import dedent from "ts-dedent";

const composer = new Composer<BotContext>()

async function answer(conversation: Conversation, ctx: BotContext, questionId: string) {
    await ctx.reply(dedent`
        💭 Напиши свой ответ
        `)
    const { message } = await conversation.waitFor("message");
    console.log("msg", message)

    return
}


export const AnswerComposer = composer;