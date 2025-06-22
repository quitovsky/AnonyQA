import { BotContext } from "@anonyqa/types";
import { Bot, Composer, Context } from "grammy";

export abstract class BotPlugin {
  abstract name: string;
  abstract composers: Composer<BotContext>[];
  log: (msg: string) => void;
  constructor() {
    this.log = (msg: string) => console.log(`[${this.name}] ${msg}`)
  }

  register(bot: Bot) {
    for(let i = this.composers.length-1; i>=0; i--) {
      // todo nahuy nado kostil? (+ line 6)
      bot.use((this.composers[i] as unknown as Composer<Context>));
    }
    this.log(`Registered ${this.composers.length} composers.`)
    return this.composers;
  }
}

