/**
 * Base class for commands
 */
class BaseCommand {
    /**
     * @param {import("discord.js").RESTPostAPIApplicationCommandsJSONBody} command 
     * @param {number} status
     */
    constructor(command, status) {
        this.data = command;
        this.status = status;
    }
}

module.exports = BaseCommand;