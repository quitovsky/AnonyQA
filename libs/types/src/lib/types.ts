import { ConversationFlavor } from '@grammyjs/conversations';
import { User } from '@prisma/client';
import { Context } from 'grammy';
export type BotContext = ConversationFlavor<Context> & {
    user: User
};