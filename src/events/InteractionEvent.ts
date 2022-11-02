import { BaseInteraction } from "discord.js";
import Lorra from "../client/client";
import { EventBase } from "../structures";

export default class InteractionEvent extends EventBase {

    constructor() {
        super("interactionCreate");
    }

    async execute(client: Lorra, interaction: BaseInteraction) {
        // SlashCommand Handler
        if(interaction.isChatInputCommand()) {
            const cmdName = interaction.commandName;
            const cmd = client.commandManager.slashCommands.get(cmdName);
            cmd?.execute(client, interaction);
        }
    }
}