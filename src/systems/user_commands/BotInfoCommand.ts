import Commands from "../../util/Commands";
import { BotColor, ComponentIds, RegistrationType } from "../../util/Enums";
import { SlashCommand } from "../../structures";
import Lorra from "../../client/Lorra";
import { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, bold, Embed, codeBlock, italic } from "discord.js";
import ms from "ms";
import { stripIndents } from 'common-tags';
import os from 'os';

export default class BotInfoCommand extends SlashCommand.Command {
    constructor() {
        super();
        this.setSlashCommandData(Commands.slash("botinfo", "Shows some information about the Bot."));
        this.setRegistrationType(RegistrationType.GUILD);
    }

    public async execute(client: Lorra, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        // Components
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
            .setLabel("Support Server")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/UCWFpjFjEf")
        );
        // Embed
        const botInfoEmbed = this.buildBotInfoEmbed(client);
        // Response
        await interaction.editReply({ embeds: [botInfoEmbed], components: [row] });
    }

    private buildBotInfoEmbed(client: Lorra) {        
        // Stats
        var guilds = client.guilds.cache.size;
        var users = client.guilds.cache.reduce((size, g) => size + g.memberCount, 0);
        var platform = process.platform.toString();
        var architecture = os.arch();
        var cpuUsage = `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)} MB`;
        var ramUsage = `${((process.memoryUsage().heapUsed / os.totalmem()) * 100).toFixed()}%`;

        return new EmbedBuilder()
            .setAuthor({ name: client.user!.tag, iconURL: client.user!.displayAvatarURL() })
            .setThumbnail(client.user!.displayAvatarURL())
            .setTitle("Bot Information")
            .setColor(BotColor.Invisible)
            .setFooter({ text: "🏓 Ping: " + ms(client.ws.ping) + `| Uptime: ${ms(Math.round(client.uptime!))}` })
            .setDescription(stripIndents`
            ${client.user!.username} is a multipurpose bot made with **discord.js** and is currently running on NodeJs (v${process.versions.node}).
            `,).addFields(
                {
                    name: "✧ System",
                    value: stripIndents`
                    ◦ ${italic("Operating System:") + ` ${platform}[${architecture}]`}
                    ◦ ${italic("CPU Usage:") + ` ${cpuUsage}`}
                    ◦ ${italic("Memory Usage:") + ` ${ramUsage}`}
                    `
                },
                { name: "✧ Servers", value: guilds.toFixed(), inline: true },
                { name: "✧ Created at",  value: client.user?.createdAt.toUTCString()!},
                { name: "Developer(s)",
                    value: stripIndents`
                    ◦ ${client.guilds.cache.get(process.env.TEST__GUILD!)?.members.cache.get('489806764934692865')?.user.tag}
                    `
                }
            );
    }
}