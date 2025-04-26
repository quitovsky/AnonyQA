import { CommandContext, Context } from "grammy";

export abstract class BotCommandAuth {
    // todo: types
    abstract auth: (ctx: CommandContext<Context>) => Promise<boolean> | boolean;
    abstract onForbidden?: (ctx: CommandContext<Context>) => Promise<void> | void;
}
