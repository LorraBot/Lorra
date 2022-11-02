import { UserContextMenuCommandInteraction } from "discord.js";
import ContextCommand from "./ContextCommand";

export default abstract class UserContextCommand extends ContextCommand {
    public abstract execute(interaction: UserContextMenuCommandInteraction): void;
}