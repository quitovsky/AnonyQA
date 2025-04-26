import { Bot, Composer, Context } from "grammy";

export abstract class BotPlugin {
  abstract name: string;
  abstract composers: Composer<Context>[];
  log: (msg: string) => void;
  constructor() {
    this.log = (msg: string) => console.log(`[${this.name}] ${msg}`)
  }

  register(bot: Bot) {
    for(let i = this.composers.length-1; i>=0; i--) {
      bot.use(this.composers[i]);
    }
    this.log(`Registered ${this.composers.length} composers.`)
    return this.composers;
  }
}

