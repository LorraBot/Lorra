import { BaseInteraction, Events } from "discord.js";
import Lorra from "../client/Lorra";
import { EventBase } from "../structures";

export default class InteractionEvent extends EventBase {

    constructor() {
        super(Events.InteractionCreate);
    }

    async execute(client: Lorra, interaction: BaseInteraction) {
        /**
         * Handle SlashCommand Interaction
         */
        if(interaction.isChatInputCommand()) {client.interactionManager.handleSlashCommand(interaction);};

        /**
         * Handle MessageContextCommand Interaction
         */
        if(interaction.isMessageContextMenuCommand()) {client.interactionManager.handleMessageContextCommand(interaction);};

        /**
         * Handle UserContextCoommand Interaction
         */
        if(interaction.isUserContextMenuCommand()) {client.interactionManager.handleUserContextCommand(interaction);};

        /**
         * Handle Button Interaction
         */
        if(interaction.isButton()) {client.interactionManager.handleButton(interaction);};

        /**
         * Handle ModalSubmit Interaction
         */
        if(interaction.isModalSubmit()) {client.interactionManager.handleModal(interaction);};
    }
}