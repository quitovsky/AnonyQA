import { CommandContext, Context } from "grammy";

type TBotCommandAuth = (ctx: CommandContext<Context>) => Promise<boolean> | boolean;
type TBotCommandAuthOnForbidden = (ctx: CommandContext<Context>) => Promise<void> | void;

export abstract class BotCommandAuth {
    abstract auth: TBotCommandAuth;
    abstract onForbidden?: TBotCommandAuthOnForbidden;
}
