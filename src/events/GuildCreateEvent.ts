import Lorra from "../client/Lorra";
import { Guild } from "discord.js";
import { EventBase } from "../structures";

export default class GuildCreateEvent extends EventBase {
    constructor() {
        super("guildCreate");
    }

    async execute(client: Lorra, guild: Guild) {
        client.guildSettingsManager.addGuild(guild);
    }
}