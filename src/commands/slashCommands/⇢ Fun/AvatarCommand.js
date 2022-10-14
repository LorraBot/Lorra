'use strict';

const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const Lorra = require('../../../client/Lorra');
const SlashCommand = require('../../../structures/command/SlashCommand');
const CommandStatus = require('../../../util/CommandStatus');

/**
 * Sends the/a avatar to the command user
 */
class AvatarCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('avatar')
            .setDescription('📷 View yours or another users avatar :O')
            .addUserOption(option => option.setName('user').setDescription("🤖 Who's avatar to view?").setRequired(false))
            .toJSON(), CommandStatus.Public);
    }

    /**
     * @param {Lorra} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new EmbedBuilder()
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

module.exports = AvatarCommand;