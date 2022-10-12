import { Guild } from "discord.js";
import { DataSource } from "typeorm";
import Lorra from "../client";
import { GuildsRepo } from "../util/typeorm";

export default class GuildManager {
    private client: Lorra;
    private dataSource: Promise<DataSource>;
    constructor(client: Lorra) {
        this.client = client;
        this.initialize();
    }
    private async initialize(): Promise<void> {
        (await this.client.dataSource).getRepository(GuildsRepo).createQueryBuilder()
            .select()
            .cache(true);
    }
    public async createGuild(guild: Guild) {
        const guildD = (await this.client.dataSource).getRepository(GuildsRepo).createQueryBuilder()
        .insert()
        .values()
    }

    public async guildExists(id: string): boolean {
        const guild = (await this.client.dataSource).getRepository(GuildsRepo).findOne({ where: {id} });
        return (guild ? true : false);
    }
}