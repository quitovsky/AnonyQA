import { BotCommand } from "@anonyqa/plugins";
import { CommandContext, Context } from "grammy";
import { guards } from "../../guards";

export class StartCommand extends BotCommand {
  constructor(){
    super("start")
  }

  auth = guards.TEST_GUARD;
  async run(ctx: CommandContext<Context>) {
    ctx.reply("Welcome.")
  };
}