import { Bot } from "grammy";
import { BotPlugin } from "./plugin";

export class BotPluginManager {
    constructor(bot: Bot, plugins: BotPlugin[]) {
      for(let i=plugins.length-1; i>=0; i--) {
        plugins[i].register(bot);
      }
    }
  }