import Lorra from "../../client/Lorra";
import { ChatInputCommandInteraction, CacheType, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ButtonInteraction, ButtonComponent } from "discord.js";
import ms from "ms";
import { ComponentIdBuilder, SlashCommand } from "../../structures";
import Commands from "../../util/Commands";
import { BotColor, ComponentIds } from "../../util/Enums";
import FunService from "./FunService";

export default class RPSCommand extends SlashCommand.Command {
    constructor() {
        super();
        this.setSlashCommandData(Commands.slash("rps", "🪨Rock.. 📃Paper.. ✂️Scissors.. SHOOT!")
            .addUserOption(option => option.setName('user').setDescription('User to play RPS with.').setRequired(false))
        );
    }

    public async execute(client: Lorra, interaction: ChatInputCommandInteraction) {
        const service = new FunService();
        service.handleRps(interaction);
    }
}