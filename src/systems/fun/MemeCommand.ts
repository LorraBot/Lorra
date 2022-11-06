import client from "../../client/Lorra";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../structures";
import Commands from "../../util/Commands";
import { default as axios } from 'axios';
import { BotColor } from "../../util/Enums";
import FunService from "./FunService";

export default class MemeCommand extends SlashCommand.Command {
    constructor() {
        super();
        this.setSlashCommandData(Commands.slash('meme', 'Memeeeeessss'));
    }

    public async execute(client: client, interaction: ChatInputCommandInteraction) {
        const service = new FunService();
        service.handleMeme(interaction);
    }
}