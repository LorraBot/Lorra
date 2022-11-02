import { Client, Guild } from "discord.js";
import CommandRequirements from "./CommandRequirements";
import { RegistrationType } from "./RegistrationType";

export default abstract class ExecutableCommand extends CommandRequirements {
    private whitelistedGuilds: Array<string> = Array.of();
    private blacklistedGuilds: Array<string> = Array.of();

    private type: RegistrationType = RegistrationType.GLOBAL;

    public whitelistGuilds(...guilds: string[]): void {
        if(this.type != RegistrationType.GUILD)
            throw new Error("Cannot whitelist Guilds for global commands.");
        this.whitelistedGuilds = guilds;
    }

    public blacklistGuilds(...guilds: string[]): void {
        if(this.type != RegistrationType.GUILD)
            throw new Error("Cannot blacklist Guilds for global commands.");
        this.blacklistedGuilds = guilds;
    }

    public getGuilds(client: Client): Array<Guild> {
        var guilds: (Guild)[] = Array.from(client.guilds.cache.values());
        guilds.filter((g) => this.blacklistedGuilds.includes(g!.id));
        if(this.whitelistedGuilds.length !== 0)
            guilds = Array.from(this.whitelistedGuilds.map((id) => client.guilds.cache.get(id)!).values());
        return guilds;
    }

    public getRegistrationType(): RegistrationType {
        return this.type;
    }

    public setRegistrationType(type: RegistrationType): void {
        this.type = type;
    }
}