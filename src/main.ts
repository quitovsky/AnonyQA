import { BotPluginManager } from "@grammy-template/plugins";
import "dotenv/config";
const TELEGRAM_MAIN_BOT_TOKEN = process.env.TELEGRAM_MAIN_BOT_TOKEN;
if(!TELEGRAM_MAIN_BOT_TOKEN) throw new Error("TELEGRAM_MAIN_BOT_TOKEN is not defined");

import { Bot } from "grammy";
import { plugins } from "./plugins/plugins";
import { Commands } from "@grammy-template/shared";
const bot = new Bot(TELEGRAM_MAIN_BOT_TOKEN);

const pluginManager = new BotPluginManager(bot, plugins);

bot.api.setMyCommands(Commands.getCommands())
bot.start({
    onStart: (me) => console.log(`Bot started as ${me.username} (https://t.me/${me.username})`)
})
