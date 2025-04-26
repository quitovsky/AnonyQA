import { BotCommand as TBotCommand } from "grammy/types";

class CommandsStorage {
  private commands: TBotCommand[] = [];

  addCommand(command: TBotCommand) {
    this.commands.push(command);
  }
  getCommands() {
    return this.commands;
  }
}

export const Commands = new CommandsStorage();