import Bot from "../bot";
import Lorra from "../client/client";
import { EventBase } from "../structures";

export default class ReadyEvent extends EventBase {

    constructor() {
        super("ready");
    }

    execute(client: Lorra): void {
        Bot.logger.info(`┍✱ Logged in as ${client.user?.username}`, 'blue')
        Bot.logger.info(`┞✱ Guilds: ${client.guilds.cache.size}`, 'blue')
        Bot.logger.info(`┞✱ Commands: ${client.application?.commands.cache.size}`, 'blue')
        Bot.logger.info("┗✱ Locked and loaded 😎", 'blue')
    }
}