import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import ExecutableCommand from "../ExecutableCommand";

export default abstract class ContextCommand extends ExecutableCommand {
    private commandData: ContextMenuCommandBuilder|null = null;

    protected ContextCommand() {}

    public getCommandData(): ContextMenuCommandBuilder {
        return this.commandData!;
    }

    public setCommandData(commandData: ContextMenuCommandBuilder): void {
        if(commandData.type === ApplicationCommandType.Message || commandData.type === ApplicationCommandType.User) {
            this.commandData = commandData;
        } else {
            
        }
    }
}