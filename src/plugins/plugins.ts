import { QuestionsPlugin } from "./questions/questions.plugin";
import { StartPlugin } from "./start/start.plugin";

export const plugins = [
    // ! QUESTIONS MUST BE OVER START
    new StartPlugin(),
    new QuestionsPlugin(),
]