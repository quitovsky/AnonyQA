import { BotPlugin } from "@anonyqa/plugins";
import { StartCommand } from "./start.command";

export class StartPlugin extends BotPlugin {
    name = "START";
    composers = [
        new StartCommand()
    ];
}