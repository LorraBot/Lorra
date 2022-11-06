import Lorra from "../../../client/Lorra";
import { ChatInputCommandInteraction, CacheType, EmbedBuilder, ButtonInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, Embed } from "discord.js";
import { SlashCommand } from "../../../structures";
import Commands from "../../../util/Commands";
import axios from "axios";
import { BotColor, RegistrationType } from "../../../util/Enums";
import FunService from "../FunService";

export default class TODCommand extends SlashCommand.Command {
    constructor() {
        super();
        this.setSlashCommandData(Commands.slash('tod', 'Truth? or Dare?'));
        this.setRegistrationType(RegistrationType.GUILD);
    }

    public async execute(client: Lorra, interaction: ChatInputCommandInteraction) {
        const service = new FunService();
        service.handleTod(interaction);
    }
}