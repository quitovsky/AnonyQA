import { prisma } from "@anonyqa/shared";
import { BotContext } from "@anonyqa/types";
import { Composer } from "grammy";

const composer = new Composer<BotContext>()

composer.use(async (ctx, next) => {
    if(!ctx.from || !ctx.from.id || ctx.from.is_bot) return next();
    const user = await prisma.user.upsert({
        where: {
            telegramId: ctx.from.id.toString(),
        },
        update: {},
        create: {
            telegramId: ctx.from.id.toString()
        }
    })
    ctx.user = user;
    next()
})

export const contextMiddleware = composer;