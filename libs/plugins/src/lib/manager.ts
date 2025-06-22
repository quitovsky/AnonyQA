import { Bot } from "grammy";
import { BotPlugin } from "./plugin";

export class BotPluginManager {

    private bot: Bot;

    constructor(bot: Bot) {
      this.bot = bot;
    }

    registerPlugins(plugins: BotPlugin[]) {
      for(let i=plugins.length-1; i>=0; i--) {
        plugins[i].register(this.bot);
      }
    }
  }