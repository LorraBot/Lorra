import { Guild } from "discord.js";
import Lorra from "../client";
import BaseEvent from "../util/structures/BaseEvent";
import { GuildsRepo } from "../util/typeorm";

export default class GuildCreateEvent extends BaseEvent {
    constructor() {
        super("guildCreate");
    }

    async exec(client: Lorra, guild: Guild) {
        
    }
}