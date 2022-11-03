import { Client, Guild } from "discord.js";
import CommandRequirements from "./CommandRequirements";
import { RegistrationType } from "./RegistrationType";

export default abstract class ExecutableCommand extends CommandRequirements {
    private type: RegistrationType = RegistrationType.GLOBAL;

    public getRegistrationType(): RegistrationType {
        return this.type;
    }

    public setRegistrationType(type: RegistrationType): void {
        this.type = type;
    }
}