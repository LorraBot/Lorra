'use strict';

const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const Lorra = require('../../../client/Lorra');
const SlashCommand = require('../../../structures/command/SlashCommand');
const CommandStatus = require('../../../util/CommandStatus');
const ColorUtils = require('../../../util/ColorUtils');

const filter = [
    'cat',
    'cats',
    'catpics',
    'kittens'
];

/**
 * Sends the/a avatar to the command user
 */
class CatCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('cat')
            .setDescription('😻 Beautiful cats')
            .toJSON(), CommandStatus.Testing);
    }

    /**
     * @param {Lorra} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const data = await fetch(`https://imgur.com/r/${filter[Math.floor(Math.random() * filter.length)]}/hot.json`)
            .then(res => res.json())
            .then(body => body.data);
        const selected = data[Math.floor(Math.random() * data.length)];
        const embed = new EmbedBuilder()
            .setName('OMG! Cats :D')
            .setColor(ColorUtils.Invisible)
            .setImage(selected);
        return await interaction.reply({ embeds: [embed] });
    }
}

module.exports = CatCommand;