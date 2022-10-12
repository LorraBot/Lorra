'use strict';

const path = require('path');
const fs = require('fs/promises');
const Lorra = require('../client/Lorra');
const { Collection, REST, Routes } = require('discord.js');
const CommandStatus = require('../util/CommandStatus');

/**
 * Handles all command registry's
 */
class CommandManager {
    /**
     * @param {Lorra} client 
     */
    constructor(client) {
        this.client = client;

        /**
         * Collection of all commands
         */
        this.commands = new Collection();

        /**
         * SlashCommand Map
         */
        this.slashCommands = new Collection();

        this.initialize().finally(() => { this.deploy() });
    }

    async initialize(basePath = "./commands/") {
        const cmdPath = path.join(__dirname, `../${basePath}`);
        try {
            await this.registerSlashCommands(path.join(cmdPath, 'slashCommands'));
        } catch (err) { console.log(err) }
    }

    /**
     * Register all slashCommands
     * @param {string} dir 
     */
    async registerSlashCommands(dir) {
        const files = await fs.readdir(dir);
        for (const file of files) {
            const cmdPath = path.join(dir, file);
            const stat = await fs.lstat(cmdPath);
            if (stat.isDirectory()) return this.registerSlashCommands(cmdPath);
            const Command = require(cmdPath);
            const cmd = new Command();
            this.slashCommands.set(cmd.data.name, cmd);
            if (!this.commands.get(cmd.status)) this.commands.set(cmd.status, []);
            this.commands.get(cmd.status).push(cmd.data);
        }
    }

    deploy() {
        // Create REST connection to the Discord API
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        /**
         * Deploy public commands to the Discord API
         */
        if (this.commands.get(CommandStatus.Public)) {
            const commands = this.commands.get(CommandStatus.Public);
            rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commands });
        }

        /**
         * Deploy all Private & Testing commands to the development guild
         */
        if (this.commands.get(CommandStatus.Testing)) {
            const commands = this.commands.get(CommandStatus.Testing);
            rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.TEST_GUILD), { body: commands });
        }
    }
}

module.exports = CommandManager;