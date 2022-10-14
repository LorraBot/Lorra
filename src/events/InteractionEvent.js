'use strict';

const { BaseInteraction } = require('discord.js');
const Lorra = require('../client/Lorra');
const BaseEvent = require('../structures/BaseEvent');

/**
 * Handles all interactions
 */
class InteractionEvent extends BaseEvent {
    constructor() {
        super("interactionCreate");
    }

    /**
     * @param {Lorra} client 
     * @param {BaseInteraction} interaction 
     */
    async execute(client, interaction) {
        if (interaction.isChatInputCommand()) {
            const cmd = client.commandManager.slashCommands.get(interaction.commandName);
            await cmd.execute(client, interaction);
        }
    }
}

module.exports = InteractionEvent;