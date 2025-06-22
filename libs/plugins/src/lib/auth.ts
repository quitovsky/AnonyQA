import { BotContext } from '@anonyqa/types';
import { CommandContext, Context } from "grammy";

type TBotCommandAuth = (ctx: CommandContext<BotContext>) => Promise<boolean> | boolean;
type TBotCommandAuthOnForbidden = (ctx: CommandContext<BotContext>) => Promise<void> | void;

export abstract class BotCommandAuth {
    abstract auth: TBotCommandAuth;
    abstract onForbidden?: TBotCommandAuthOnForbidden;
}
