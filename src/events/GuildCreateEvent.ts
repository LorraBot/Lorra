import Lorra from "../client/Lorra";
import { Events, Guild } from "discord.js";
import { EventBase } from "../structures";

export default class GuildCreateEvent extends EventBase {
    constructor() {
        super(Events.GuildCreate);
    }

    async execute(client: Lorra, guild: Guild) {
        client.guildSettingsManager.addGuild(guild);
    }
}