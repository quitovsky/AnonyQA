import { Commands } from '@anonyqa/shared';
import { CommandContext, Composer } from "grammy";
import { BotCommandAuth } from './auth';
import { BotContext } from '@anonyqa/types';

export abstract class BotCommand extends Composer<BotContext> {
    name: string;
    description?: string;

    abstract run(ctx: CommandContext<BotContext>): Promise<void> | void;

    abstract auth?: BotCommandAuth;

    constructor(name: string, description?: string) {
        super();
        this.name = name;
        this.description = description;
        if(name && description) {
            Commands.addCommand({ command: name, description })
        }
        this.command(name, this.execute.bind(this))
    }

    async execute(ctx: CommandContext<BotContext>) {
        if(this.auth && !(await this.auth.auth(ctx))) {
            if(this.auth.onForbidden) {
                await this.auth.onForbidden(ctx);
            }
            return;
        }
        await this.run(ctx);
    }
}