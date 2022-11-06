import Lorra from "client/Lorra";
import { 
    ChatInputCommandInteraction, 
    Collection, 
    SlashCommandBuilder, 
    SlashCommandSubcommandBuilder, 
    SlashCommandSubcommandGroupBuilder 
} from "discord.js";
import CommandRequirements from "./CommandRequirements";
import ExecutableCommand from "./ExecutableCommand";

export namespace SlashCommand {
    export abstract class Command extends ExecutableCommand {
        private commandData: SlashCommandBuilder|null = null;
        private subcommands: Array<SlashCommand.Subcommand> = Array.of();
        private subcommandGroups: Collection<SlashCommandSubcommandGroupBuilder, Array<SlashCommand.Subcommand>> = new Collection();

        protected constructor() {
            super();
        }

        public execute(client: Lorra, interaction: ChatInputCommandInteraction): void {}

        public getSlashCommandData() {
            if(this.subcommandGroups) {
                this.subcommandGroups.forEach((value, key) => {
                    value.forEach((cmd) => {
                        key.addSubcommand(cmd.getSubcommandData());
                    });
                    this.commandData!.addSubcommandGroup(key);
                });
            }
            if(this.subcommands && !this.subcommandGroups) {
                this.subcommands.forEach((value) => {
                    this.commandData!.addSubcommand(value.getSubcommandData());
                });
            }
            return this.commandData!;
        }

        public setSlashCommandData(commandData: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">|SlashCommandBuilder): void {
            this.commandData = (commandData as SlashCommandBuilder);
        }

        public getSubcommands(): Array<SlashCommand.Subcommand> {
            return this.subcommands;
        }

        public addSubcommands(...classes: SlashCommand.Subcommand[]): void {
            this.subcommands = classes;
        }

        public getSubcommandGroups(): Collection<SlashCommandSubcommandGroupBuilder, Array<SlashCommand.Subcommand>> {
            return this.subcommandGroups;
        }

        public addSubcommandGroups(groups: Collection<SlashCommandSubcommandGroupBuilder, Array<SlashCommand.Subcommand>>): void {
            this.subcommandGroups = groups;
        }
    }
    export abstract class Subcommand extends CommandRequirements {
        private data: SlashCommandSubcommandBuilder|null = null;

        public getSubcommandData(): SlashCommandSubcommandBuilder {
            return this.data!;
        }
    
        public setSubcommandData(subCommandData: SlashCommandSubcommandBuilder): void {
            this.data = subCommandData;
        }
    
        public abstract execute(interaction: ChatInputCommandInteraction): void;
    }
}