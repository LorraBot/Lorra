'use strict';

const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const Lorra = require('../../../client/Lorra');
const SlashCommand = require('../../../structures/command/SlashCommand');
const CommandStatus = require('../../../util/CommandStatus');
const ColorUtils = require('../../../util/ColorUtils');

const options = ['rock', 'paper', 'scissors'];

/**
 * Test your chances with Rock, Paper, Scissors
 */
class RPSCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('rps')
            .setDescription('🪨Rock.. 📃Paper.. ✂️Scissors.. SHOOT!')
            .addStringOption(option =>
                option.setName('choice')
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
        // Choices
        const uChoice = interaction.options.getString('choice', true);
        const bChoice = options[Math.floor(Math.random() * options.length)];
        // Create the message embed
        const embed = new EmbedBuilder().setColor(ColorUtils.Invisible);
        // Checks if the Bot's and User's reaction are the same
        if (uChoice === bChoice) embed.setTitle(`Uh OH! Looks like we both chose ${uChoice}.`)
            .setDescription('Run the command again and see what your outcome is :D')
            .setColor(ColorUtils.Invisible);
        // Choice Decider
        if (uChoice === 'rock' && bChoice === 'scissors') {
            embed.setTitle('Wowwww! You WON! Congratulations 🎉')
                .setDescription("🪨Rock **CRUSHES** ✂️Scissors!");
        } else if (uChoice === 'paper' && bChoice === 'rock') {
            embed.setTitle('Wowwww! You WON! Congratulations 🎉')
                .setDescription("📃Paper **COVERS** 🪨Rock!");
        } else if (uChoice === 'scissors' && bChoice === 'paper') {
            embed.setTitle('Wowwww! You WON! Congratulations 🎉')
                .setDescription("✂️Scissor's cut 📃Paper!");
        } else {
            embed.setTitle('Oh Nooooo! Looks like you lost!')
                .setDescription(`I chose \`${bChoice}\`. Let's play again :D`);
        }
        // Return the interation
        return await interaction.reply({ embeds: [embed] });
    }
}

module.exports = RPSCommand;