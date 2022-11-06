import { SlashCommand } from "../../structures";
import Commands from "../../util/Commands";

export default class SettingsCommand extends SlashCommand.Command {
    constructor() {
        super();
        this.setSlashCommandData(Commands.slash("settings", "Manage guild settings"));
    }
}