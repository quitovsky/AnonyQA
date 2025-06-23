import { prisma } from "@anonyqa/shared";
import { BotContext } from "@anonyqa/types";
import { Composer, InlineKeyboard } from "grammy";
import dedent from "ts-dedent";

const composer = new Composer<BotContext>();

// todo unify and move to utils
function declineAnswers(count: number): string {
    const absCount = Math.abs(count);
    const mod10 = absCount % 10;
    const mod100 = absCount % 100;
  
    let form: string;
  
    if (mod100 >= 11 && mod100 <= 14) {
      form = 'ответов';
    } else if (mod10 === 1) {
      form = 'ответ';
    } else if (mod10 >= 2 && mod10 <= 4) {
      form = 'ответа';
    } else {
      form = 'ответов';
    }
  
    return `${count} ${form}`;
  }
  

composer.callbackQuery(/^questions-/, async ctx => {
    await ctx.deleteMessage();
    const page = Number(ctx.callbackQuery.data.replace("questions-", ""));
    if(isNaN(page)) return await ctx.reply("😢 что-то пошло не так...");
    const questions = await prisma.question.findMany({
        where: {
            authorId: ctx.user.id,
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 5,
        skip: 5*page,
    });
    const count = await prisma.question.count({
        where: {
            authorId: ctx.user.id
        }
    })
    
    if(questions.length === 0) return await ctx.reply(dedent`
        у тебя пока нет созданных вопросов &gt;_&lt;
        
        чтобы опубликовать вопрос, напиши в <i>поле ввода публикации в канале</i>:
        <blockquote><b>@anonyqabot</b> <i>&lt;вопрос&gt;</i></blockquote>
        и нажмии <b><i>«опубликовать вопрос»</i></b>
        `, {
            parse_mode: "HTML"
        })

    const reply_markup = new InlineKeyboard();
    for(const q of questions) {
        reply_markup.text(`${q.question}`, `q:${q.nanoid}`)
        reply_markup.row()
    }
    if(page > 0) {
        reply_markup.text(`←`, `questions-${page-1}`)
    }
    if(count > (page+1)*5) {
        reply_markup.text(`→`, `questions-${page+1}`)
    }
    await ctx.reply(dedent`
        💌 твои вопросы:
        `, {
            reply_markup
        })
})

composer.callbackQuery(/^q:+/, async ctx => {
    await ctx.deleteMessage();
    const questionId = ctx.callbackQuery.data.substring(2);
    const question = await prisma.question.findFirst({
        where: {
            nanoid: questionId
        },
        include: {
            _count: true
        }
    })
    if(!question) return await ctx.reply("😢 что-то пошло не так");
    const count = question._count.answers;
    await ctx.reply(dedent`
        ❓: ${question.question}
        💌: <i>${declineAnswers(count)}</i>

        <i>создан ${question.createdAt.toLocaleString('ru-RU')}</i>}
        `, {
            parse_mode: "HTML"
        })
})

export const CreatedQuestionsComposer = composer;