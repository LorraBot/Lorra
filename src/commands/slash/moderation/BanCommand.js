import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import SlashCommand from '../../../util/structures/command/SlashCommand.js';

export default class BanCommand extends SlashCommand {
    constructor() {
        super("ban", new SlashCommandBuilder()
            .setName("ban")
            .setDescription("Ban a user")
            .addUserOption(input => input.setName("user").setDescription("User to be banned").setRequired(true))
            .toJSON());
    }
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async exec(client, interaction) { }
}