import { CommandContext, Context } from "grammy";
import { BotCommandAuth } from "@grammy-template/plugins";

export class BotTestGuard extends BotCommandAuth {
    auth: (ctx: CommandContext<Context>) => Promise<boolean> | boolean
        = async (ctx) => {
            if(ctx.from.id === Number(process.env.DEBUG_ADMIN_ID)) {
                return true;
            }
            return false;
        };
    onForbidden?: (ctx: CommandContext<Context>) => Promise<void> | void
        = async (ctx) => {
            await ctx.reply("You can't use this command.")
        };
}