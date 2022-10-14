'use strict';

const Lorra = require('../../../client/Lorra');
const SlashCommand = require('../../../structures/command/SlashCommand');
const CommandStatus = require('../../../util/CommandStatus');
const ColorUtils = require('../../../util/ColorUtils');
const ms = require('ms');
const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder, ButtonBuilder,
    ButtonStyle,
    ComponentType,
    ActionRowBuilder,
    Collection
} = require('discord.js');

/**
 * Test your chances with Rock, Paper, Scissors
 */
class RPSCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('rps')
            .setDescription('🪨Rock.. 📃Paper.. ✂️Scissors.. SHOOT!')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('❓What do you pick? Rock, Paper or Scissors.')
                    .setRequired(true)
            )
            .toJSON(), CommandStatus.Testing);
    }

    /**
     * @param {Lorra} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const results = new Collection();
        const user = interaction.options.getUser('user', true);

        if (interaction.user.id === user.id)
            return interaction.reply(
                {
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Oh Noo!")
                            .setDescription("You can't just play yourself. Find someone to play a game with and try again :D")
                            .setColor('Red')
                    ],
                    ephemeral: true
                });

        // -- Components --
        const RBtn = new ButtonBuilder().setEmoji('🪨').setLabel('Rock').setCustomId('rock').setStyle(ButtonStyle.Danger);
        const PBtn = new ButtonBuilder().setEmoji('📃').setLabel('Paper').setCustomId('paper').setStyle(ButtonStyle.Primary);
        const SBtn = new ButtonBuilder().setEmoji('✂️').setLabel('Scissors').setCustomId('scissors').setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(RBtn, PBtn, SBtn);
        // ----

        await interaction.reply({
            content: `${user}`,
            embeds: [
                new EmbedBuilder()
                    .setTitle('Rock..Paper..Scissors.. SHOOT!!')
                    .setColor(ColorUtils.Invisible)
                    .setDescription(`${interaction.user} has invited ${user} to play Rock..Paper..Scissors. Use the buttons below to select your choice.\n*Button session will end in 1m*`)
            ],
            components: [row]
        });

        const filter = i => {
            const responded = results.get(i.user.id);
            if (responded) {
                i.reply({ embeds: [new EmbedBuilder().setTitle('Ohh Noo! Looks like you have already chosen.').setColor('Red')], ephemeral: true });
            }
            return (i.user.id === interaction.user.id || i.user.id === user.id) && !responded;
        }
        const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: ms('1m'), filter, maxUsers: 2 });

        collector.on('collect', (interaction) => {
            results.set(interaction.user.id, interaction.component.customId);
            console.log(interaction.component.customId);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Option Chosen!`)
                        .setDescription(`You have chosen ${interaction.component.label}. Good Luck!`)
                        .setColor('Green')
                ],
                ephemeral: true
            });
        });
        collector.on('end', () => {
            // -- Disable Buttons --
            row.components.forEach((value) => value.setDisabled(true));
            interaction.editReply({ components: [row] });
            // ----
            const response = new EmbedBuilder().setColor('Green');

            const res1 = results.get(interaction.user.id);
            const res2 = results.get(user.id);

            if (res1 === res2)
                return interaction.followUp({ embeds: [response.setTitle('Looks like it was a draw 🤷')] });

            if (res1 === 'rock' && res2 === 'paper') {
                response.setTitle(`🎉 ${user.username} has Won! 🎉`);
            } else if (res1 === 'paper' && res2 === 'scissors') {
                response.setTitle(`🎉 ${user.username} has Won! 🎉`);
            } else if (res1 === 'scissors' && res2 === 'rock') {
                response.setTitle(`🎉 ${user.username} has Won! 🎉`);
            } else {
                response.setTitle(`🎉 ${interaction.user.username} has Won! 🎉`);
            }
            return interaction.followUp({
                embeds: [response]
            });
        });
        results.clear();
    }
}

module.exports = RPSCommand;