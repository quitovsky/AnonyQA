import { BotPlugin } from "@grammy-template/plugins";
import { StartCommand } from "./start.command";
// import { startCommand } from "./start.command";

export class StartPlugin extends BotPlugin {
    name = "START";
    composers = [
        new StartCommand()
    ];
}