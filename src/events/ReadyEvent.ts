import { Events } from "discord.js";
import Bot from "../bot";
import Lorra from "../client/Lorra";
import { EventBase } from "../structures";

export default class ReadyEvent extends EventBase {

    constructor() {
        super(Events.ClientReady);
    }

    execute(client: Lorra): void {
        Bot.logger.info(`┍✱ Logged in as ${client.user?.username}`)
        Bot.logger.info(`┞✱ Guilds: ${client.guilds.cache.size}`)
        Bot.logger.info(`┞✱ Commands: ${client.application?.commands.cache.size}`)
        Bot.logger.info("┗✱ Locked and loaded 😎")

        client.guilds.cache.forEach((guild) => client.guildSettingsManager.addGuild(guild));
    }
}