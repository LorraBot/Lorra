import { ApplicationCommandType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import ExecutableCommand from "./ExecutableCommand";

export namespace ContextCommand {
    export abstract class Command extends ExecutableCommand {
        private commandData: ContextMenuCommandBuilder|null = null;

        protected constructor() {super()}
    
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
    export abstract class Message extends ContextCommand.Command {
        public abstract execute(interaction: MessageContextMenuCommandInteraction): void;
    }
    export abstract class User extends ContextCommand.Command {
        public abstract execute(interaction: UserContextMenuCommandInteraction): void;
    }
}