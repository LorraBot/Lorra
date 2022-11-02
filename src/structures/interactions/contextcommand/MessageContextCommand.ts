import { MessageContextMenuCommandInteraction } from "discord.js";
import ContextCommand from "./ContextCommand";

export default abstract class MessageContextCommand extends ContextCommand {
    public abstract execute(interaction: MessageContextMenuCommandInteraction): void;
}