import { ProfilePlugin } from "./profile/profile.plugin";
import { QuestionsPlugin } from "./questions/questions.plugin";
import { StartPlugin } from "./start/start.plugin";

export const plugins = [
    // ! QUESTIONS MUST BE UNDER START
    new StartPlugin(),
    new QuestionsPlugin(),
    new ProfilePlugin(),
]