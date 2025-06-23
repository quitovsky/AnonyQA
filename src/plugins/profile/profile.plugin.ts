import { BotPlugin } from '@anonyqa/plugins';
import { ProfileCommand } from './profile.command';
import { CreatedQuestionsComposer } from './created-questions.composer';
export class ProfilePlugin extends BotPlugin {
    name = "AUTHOR";
    composers = [
        new ProfileCommand(),
        CreatedQuestionsComposer,
    ]
}