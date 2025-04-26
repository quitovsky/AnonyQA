import { BotCommand } from "@anonyqa/plugins";
import { CommandContext, Context } from "grammy";
import { prisma } from "@anonyqa/shared";

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
        
        const question = await prisma.question.findUnique({
          where: { nanoid: questionId }
        })
        if(!question) {
          ctx.reply(`Что-то пошло не так. Вопрос не найден. 😢`)
          return;
        }
      }
    }
    ctx.reply("Welcome.")
  };
}