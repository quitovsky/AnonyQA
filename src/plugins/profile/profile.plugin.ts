import { BotPlugin } from '@anonyqa/plugins';
import { ProfileCommand } from './profile.command';
export class ProfilePlugin extends BotPlugin {
    name = "AUTHOR";
    composers = [
        new ProfileCommand(),
    ]
}