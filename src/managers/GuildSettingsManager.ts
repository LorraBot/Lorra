import Bot from "../bot";
import Lorra from "../client/Lorra";
import { ChannelType, Collection, Guild } from "discord.js";
import { Repository } from "typeorm";
import { GuildSettings } from "../util/typeorm/entities/GuildSettings";

export default class GuildSettingsManager {
    private client: Lorra;
    private _guildSettings: Collection<string, GuildSettings> = new Collection();

    constructor(client: Lorra) {
        this.client = client;
        this.initialise()
            .then(() => Bot.logger.test("Loaded guild settings!"))
            .catch((reason) => Bot.logger.error(reason));
    }

    public async initialise() {
        const dataSource = await this.client.dataSource;
        const result = await dataSource.getRepository(GuildSettings).createQueryBuilder().select().getMany()
        result.forEach((setting) => this._guildSettings.set(setting.id, setting));
    }

    public async addGuild(guild: Guild) {
        const dataSource = await this.client.dataSource;
        var modlogChannel: string = guild.channels.cache.find((c) => c.name.includes("mod-log"))?.id!;
        const setting = dataSource.getRepository(GuildSettings).create({ id: guild.id, modlogChannel });
        dataSource.getRepository(GuildSettings).createQueryBuilder()
            .insert()
            .values(setting)
            .orUpdate(['mod_log'])
            .execute();
        return setting;
    }

    public getGuildSettings(): Collection<string, GuildSettings> {return this._guildSettings;}
}