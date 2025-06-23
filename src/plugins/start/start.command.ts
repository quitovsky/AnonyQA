import { BotCommand } from "@anonyqa/plugins";
import { CommandContext } from "grammy";
import { prisma } from "@anonyqa/shared";
import { BotContext } from "@anonyqa/types";
import dedent from "ts-dedent";

export class StartCommand extends BotCommand {
  constructor(){
    super("start")
  }
  // todo why tf does it require to set it manually 😭😭
  auth = null;

  async run(ctx: CommandContext<BotContext>) {
    const match = ctx.match;
    if (match && match !== "start") {
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
        await ctx.conversation.enter("handle-answer", questionId);
        return;
      }
    }
    else ctx.reply(dedent`
      <b>привет! ^_^</b>
      
      чтобы опубликовать вопрос, напиши в <i>поле ввода публикации в канале</i>:
      <blockquote><b>@anonyqabot</b> <i>&lt;вопрос&gt;</i></blockquote>
      и нажмии <b><i>«опубликовать вопрос»</i></b>


      <i><u>новости бота и не только → @wannadisappearr
      по всем вопросам → @wdpprr</u></i>
      `, {
        parse_mode: "HTML"
      })
  };
}