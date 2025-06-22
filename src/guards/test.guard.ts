import { CommandContext } from "grammy";
import { BotCommandAuth } from "@anonyqa/plugins";
import { BotContext } from "@anonyqa/types";

export class BotTestGuard extends BotCommandAuth {
    auth: (ctx: CommandContext<BotContext>) => Promise<boolean> | boolean
        = async (ctx) => {
            if(ctx.from.id === Number(process.env.DEBUG_ADMIN_ID)) {
                return true;
            }
            return false;
        };
    onForbidden?: (ctx: CommandContext<BotContext>) => Promise<void> | void
        = async (ctx) => {
            await ctx.reply("You can't use this command.")
        };
}