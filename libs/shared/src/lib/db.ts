import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function createUserIfNotExists(telegramId: string) {
    await prisma.user.upsert({
        where: { telegramId },
        create: { telegramId },
        update: {}
    })
}