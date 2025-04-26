import { QuestionsPlugin } from "./questions/questions.plugin";
import { StartPlugin } from "./start/start.plugin";

export const plugins = [
    new StartPlugin(),
    new QuestionsPlugin()
]