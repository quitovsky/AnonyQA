import { BotPluginManager } from "@anonyqa/plugins";
import "dotenv/config";
const TELEGRAM_MAIN_BOT_TOKEN = process.env.TELEGRAM_MAIN_BOT_TOKEN;
if(!TELEGRAM_MAIN_BOT_TOKEN) throw new Error("TELEGRAM_MAIN_BOT_TOKEN is not defined");

import { Bot } from "grammy";
import { plugins } from "./plugins/plugins";
import { Commands } from "@anonyqa/shared";
import { conversations } from "@grammyjs/conversations";
import { BotContext } from "@anonyqa/types";
const bot = new Bot<BotContext>(TELEGRAM_MAIN_BOT_TOKEN);

bot.use(conversations())

const pluginManager = new BotPluginManager(bot);
pluginManager.registerPlugins(plugins);

bot.api.setMyCommands(Commands.getCommands())

bot.catch(err => {
    console.error(err)
})

process.on("uncaughtException", err => {
    console.error(err)
})


bot.start({
    onStart: (me) => console.log(`Bot started as ${me.username} (https://t.me/${me.username})`)
})
