import { Conversation } from "@grammyjs/conversations";
import { Composer, Context } from "grammy";
import dedent from "ts-dedent";

const composer = new Composer<Context>()

async function answer(conversation: Conversation, ctx: Context, questionId: string) {
    await ctx.reply(dedent`
        💭 Напиши свой ответ
        `)
    const { message } = await conversation.waitFor("message:text");
    
}

export const AnswerComposer = composer;