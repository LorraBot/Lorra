import CommandRequirements from "./CommandRequirements";
import { RegistrationType } from "../../../util/Enums";

export default abstract class ExecutableCommand extends CommandRequirements {
    private type: RegistrationType = RegistrationType.GLOBAL;

    public getRegistrationType(): RegistrationType {
        return this.type;
    }

    public setRegistrationType(type: RegistrationType): void {
        this.type = type;
    }
}