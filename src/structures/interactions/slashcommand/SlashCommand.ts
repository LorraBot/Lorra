import Lorra from "client/client";
import { 
    ChatInputCommandInteraction, 
    Collection, 
    SlashCommandBuilder, 
    SlashCommandSubcommandGroupBuilder 
} from "discord.js";
import ExecutableCommand from "../ExecutableCommand";
import SlashCommandSubCommand from "./SlashCommandSubCommand";

export default abstract class SlashCommand extends ExecutableCommand {
    private commandData: SlashCommandBuilder|null = null;
    private subcommands: Array<SlashCommandSubCommand> = Array.of();
    private subcommandGroups: Collection<SlashCommandSubcommandGroupBuilder, Array<SlashCommandSubCommand>> = new Collection();

    protected constructor() {
        super();
    }

    public execute(client: Lorra, interaction: ChatInputCommandInteraction): void {}

    public getSlashCommandData(): SlashCommandBuilder {
        if(this.subcommandGroups) {
            this.subcommandGroups.forEach((value, key) => {
                value.forEach((cmd) => {
                    key.addSubcommand(cmd.getSubcommandData());
                });
                this.commandData?.addSubcommandGroup(key);
            });
        } else {
            this.subcommands.forEach((value) => {
                this.commandData?.addSubcommand(value.getSubcommandData());
            });
        }
        return this.commandData!;
    }

    public setSlashCommandData(commandData: SlashCommandBuilder): void {
        this.commandData = commandData;
    }

    public getSubcommands(): Array<SlashCommandSubCommand> {
        return this.subcommands;
    }

    public addSubcommands(...classes: SlashCommandSubCommand[]): void {
        this.subcommands = classes;
    }

    public getSubcommandGroups(): Collection<SlashCommandSubcommandGroupBuilder, Array<SlashCommandSubCommand>> {
        return this.subcommandGroups;
    }

    public addSubcommandGroups(groups: Collection<SlashCommandSubcommandGroupBuilder, Array<SlashCommandSubCommand>>): void {
        this.subcommandGroups = groups;
    }
}