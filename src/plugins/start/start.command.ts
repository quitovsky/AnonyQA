// import { Composer } from "grammy";

import { BotCommand } from "@grammy-template/plugins";
import { CommandContext, Context } from "grammy";
import { guards } from "../../guards";

// const comp = new Composer();

// comp.command("start", (ctx) => {
//   ctx.reply("Welcome to the bot!");
// });

// export const startCommand = comp;

export class StartCommand extends BotCommand {
  constructor(){
    super("start")
  }

  auth = guards.TEST_GUARD;
  async run(ctx: CommandContext<Context>) {
    ctx.reply("Welcome.")
  };
  async onUnauthorized(ctx: CommandContext<Context>){
    await ctx.reply("You are not authorized to use this command.")
  }
}