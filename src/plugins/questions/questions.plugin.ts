import { BotPlugin } from "@anonyqa/plugins";
import { QuestionsComposer } from "./questions.composer";
import { AnswerComposer } from "./answer.composer";

export class QuestionsPlugin extends BotPlugin {
    name = "QUESTIONS";
    composers = [
        AnswerComposer,
        QuestionsComposer,
    ]
}