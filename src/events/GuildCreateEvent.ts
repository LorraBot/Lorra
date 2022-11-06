import Lorra from "../client/Lorra";
import { EmbedBuilder, Events, Guild } from "discord.js";
import { EventBase } from "../structures";
import ms from "ms";
import { stripIndent } from "common-tags";

export default class GuildCreateEvent extends EventBase {
    constructor() {
        super(Events.GuildCreate);
    }

    async execute(client: Lorra, guild: Guild) {
        await client.guildSettingsManager.addGuild(guild);

        var guildOwner = await guild.fetchOwner();
        const guildLog = new EmbedBuilder()
            .setTitle('Guild Added')
            .setAuthor({ name: guildOwner.user.tag, iconURL: guildOwner.displayAvatarURL() })
            .setThumbnail(guild.iconURL()!)
            .setTimestamp()
            .setColor('Green')
            .setDescription(stripIndent`
            **Name** ◦ ${guild.name}
            **Member Count** ◦ ${guild.memberCount}
            **CreatedAt** ◦ ${guild.createdAt.toUTCString()}
            **Verified/Partnered** ◦ ${guild.verified ? "Yes" : "No"}/${guild.partnered ? "Yes" : "No"}
            `)
        const channel = client.guilds.cache.get(process.env.TEST__GUILD!)?.channels.cache.find((c) => c.name.includes("guild-log"));
        if(channel && channel.isTextBased()) {channel.send({ embeds: [guildLog] })}
    }
}