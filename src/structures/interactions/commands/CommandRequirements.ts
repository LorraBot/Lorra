import { Permissions } from "discord.js";
import ComponentHandler from "./ComponentHandler";

export default abstract class CommandRequirements extends ComponentHandler {
    private requiredPermissions: Array<Permissions> = Array.of();
    private requiredUsers: Array<string> = Array.of();

    private requiredRoles: Array<string> = Array.of();

    public requirePermissions(...permissions: string[]): void {
        this.requiredPermissions = permissions;
    }

    public requireUsers(...users: string[]): void {
        this.requiredUsers = users;
    }

    public requireRoles(...roles: string[]): void {
        this.requiredRoles = roles;
    }

    public getRequiredPermissions(): Array<Permissions> {
        return this.requiredPermissions;
    }

    public getRequiredUsers(): Array<string> {
        return this.requiredUsers;
    }

    public getRequiredRoles(): Array<string> {
        return this.requiredRoles;
    }
}