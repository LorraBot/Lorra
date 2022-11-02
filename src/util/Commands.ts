import { SlashCommandBuilder } from "discord.js";

export default class Commands {
    static slash(name: string, description: string): SlashCommandBuilder {
        return new SlashCommandBuilder().setName(name).setDescription(description);
    }
}