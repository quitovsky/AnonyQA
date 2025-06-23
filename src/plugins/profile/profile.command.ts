import { BotCommand } from "@anonyqa/plugins";
import { BotContext } from "@anonyqa/types";
import { CommandContext, InlineKeyboard } from "grammy";
import dedent from "ts-dedent";

export class ProfileCommand extends BotCommand {
    constructor() {
        super("profile")
    }

    auth = null;
    
    async run(ctx: CommandContext<BotContext>): Promise<void> {
        const reply_markup = new InlineKeyboard().text("❓ мои вопросы", "questions")
        await ctx.reply(dedent`
            ⋆ твой профиль:
            `, {
                reply_markup
            })
        return;
    }
}