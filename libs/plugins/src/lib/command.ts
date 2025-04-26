import { Commands } from '@grammy-template/shared';
import { CommandContext, Composer, Context } from "grammy";
import { BotCommandAuth } from './auth';

type TCommandRun = (ctx: CommandContext<Context>) => Promise<void>;
// todo: move auth & onUnathorized to BotAuth/BotCommandAuth class
type TCommandAuth = (ctx: CommandContext<Context>) => Promise<boolean>;
type TCommandOnUnathorized = (ctx: CommandContext<Context>) => Promise<void>
type TCommandConstructor = { name: string, run: TCommandRun, auth?: TCommandAuth, onUnauthorized?: TCommandOnUnathorized }

export abstract class BotCommand extends Composer<Context> {
    name: string;
    description?: string;

    abstract run(ctx: CommandContext<Context>): Promise<void> | void;

    abstract auth?: BotCommandAuth;
    // abstract auth(ctx: CommandContext<Context>): Promise<boolean> | boolean;
    // abstract onUnauthorized(ctx: CommandContext<Context>): Promise<void> | void;

    constructor(name: string, description?: string) {
        super();
        this.name = name;
        this.description = description;
        if(name && description) {
            Commands.addCommand({ command: name, description })
        }
        this.command(name, this.execute.bind(this))
    }

    async execute(ctx: CommandContext<Context>) {
        if(this.auth && !(await this.auth.auth(ctx))) {
            if(this.auth.onForbidden) {
                await this.auth.onForbidden(ctx);
            }
            return;
        }
        await this.run(ctx);
    }
}

// export interface BotCommand {
//     auth?(ctx: CommandContext<Context>): Promise<boolean> | boolean;
//     onUnauthorized?(ctx: CommandContext<Context>): Promise<void> | void;
// }