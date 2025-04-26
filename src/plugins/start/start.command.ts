import { BotCommand } from "@anonyqa/plugins";
import { CommandContext, Context } from "grammy";
import { guards } from "../../guards";

export class StartCommand extends BotCommand {
  constructor(){
    super("start")
  }
  // todo why tf does it require to set it manually 😭😭
  auth = null;

  async run(ctx: CommandContext<Context>) {
    const match = ctx.match;
    if (match) {
      if (match.startsWith("anon")) {
        const questionId = match.substring(4);
        if(!questionId || questionId.length !== 21) return;
        
      }
    }
    ctx.reply("Welcome.")
  };
}