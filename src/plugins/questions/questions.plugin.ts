import { BotPlugin } from "@anonyqa/plugins";
import { QuestionsComposer } from "./questions.composer";

export class QuestionsPlugin extends BotPlugin {
    name = "QUESTIONS";
    composers = [
        QuestionsComposer
    ]
}