import { 
    ChatInputCommandInteraction, 
    SlashCommandSubcommandBuilder 
} from "discord.js";
import CommandRequirements from "../CommandRequirements";

export default abstract class SlashCommandSubCommand extends CommandRequirements {
    private data: SlashCommandSubcommandBuilder|null = null;

    public getSubcommandData(): SlashCommandSubcommandBuilder {
        return this.data!;
    }

    public setSubcommandData(subCommandData: SlashCommandSubcommandBuilder): void {
        this.data = subCommandData;
    }

    public abstract execute(interaction: ChatInputCommandInteraction): void;
}