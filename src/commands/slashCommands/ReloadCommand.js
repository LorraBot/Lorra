'use strict';

const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const Lorra = require('../../client/Lorra');
const SlashCommand = require('../../structures/command/SlashCommand');
const CommandStatus = require('../../util/CommandStatus');

/**
 * ReloadCommand - Reload all/specific tasks
 * @extends {SlashCommand}
 */
class ReloadCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('reload')
            .setDescription('Reload system').toJSON(), CommandStatus.Testing);
    }

    /**
     * @param {Lorra} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        return interaction.reply({ content: 'hello', ephemeral: true });
    }
}

module.exports = ReloadCommand;