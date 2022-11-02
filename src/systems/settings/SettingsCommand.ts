import Lorra from "client/client";
import { ChatInputCommandInteraction, CacheType } from "discord.js";
import Bot from "../../bot";
import { RegistrationType, SlashCommand } from "../../structures";
import Commands from "../../util/Commands";

export default class SettingsCommand extends SlashCommand {
    constructor() {
        super();
        this.setSlashCommandData(Commands.slash("settings", "Manage guild settings"));
    }

    public execute(client: Lorra, interaction: ChatInputCommandInteraction<CacheType>) {
        Bot.logger.info('Settings command is functional!');
    }
}