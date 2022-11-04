import client from "../../client/Lorra";
import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../structures";
import Commands from "../../util/Commands";

export default class AvatarCommand extends SlashCommand {
    constructor() {
        super();
        this.setSlashCommandData(Commands.slash('avatar', 'See yours or someone elses avatar.')
            .addUserOption(option => option.setName('user').setDescription('Users avatar to get')));
    }

    public async execute(client: client, interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new EmbedBuilder();
        if (!user) {
            embed.setTitle('Uh Oh! There seems to be a problem.')
                .setColor('Red');
        } else {
            const avatar = user.avatarURL();
            embed.setColor('#2F3136')
                .setTitle(`${user.username}'s Avatar!`)
                .setURL(avatar)
                .setImage(avatar);
        }
        return await interaction.reply({ embeds: [embed] });
    }
}