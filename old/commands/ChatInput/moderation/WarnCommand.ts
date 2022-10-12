import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Lorra from "../../../client";
import ChatInputCommand from "../../../util/structures/command/ChatInputCommand";

export default class WarnCommand extends ChatInputCommand {
    constructor() {
        super(new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a spcificed user")
        .addUserOption(option=>option.setName("user").setDescription("😲 User to warn.").setRequired(true))
        .addStringOption(option=>option.setName("reason").setDescription("❓ Reason for the warning.").setRequired(false))
        .toJSON(), false)
    }

    async exec(client: Lorra, interaction: ChatInputCommandInteraction) {
        
    }
}