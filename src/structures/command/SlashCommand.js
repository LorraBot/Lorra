'use strict';

const { ChatInputCommandInteraction } = require('discord.js');
const Lorra = require('../../client/Lorra');
const BaseCommand = require('./BaseCommand');

/**
 * Base class for slashCommands
 * @extends {BaseCommand}
 */
class SlashCommand extends BaseCommand {
    /**
     * @param {import('discord.js').RESTPostAPIApplicationCommandsJSONBody} command 
     * @param {number} status
     */
    constructor(command, status) {
        super(command, status);
    }

    /**
     * @param {Lorra} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @returns {Promise<void>}
     */
    async execute(client, interaction) { }
}

module.exports = SlashCommand;