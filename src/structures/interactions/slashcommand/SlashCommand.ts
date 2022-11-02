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
    private commandData: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">|null = null;
    private subcommands: Array<SlashCommandSubCommand> = Array.of();
    private subcommandGroups: Collection<SlashCommandSubcommandGroupBuilder, Array<SlashCommandSubCommand>> = new Collection();

    protected constructor() {
        super();
    }

    public execute(client: Lorra, interaction: ChatInputCommandInteraction): void {}

    public getSlashCommandData(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return this.commandData!;
    }

    public setSlashCommandData(commandData: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">): void {
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