import path from 'path';
import fs from 'fs/promises';
import Lorra from '../client/Lorra';
import { ContextCommand, RegistrationType, SlashCommand } from '../structures';
import Bot from '../bot';
import { ApplicationCommandType, Collection, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';

/**
 * [By: BrPinkuh]
 * Command registration interface to deploy and interact
 * with commands.
 */
export default class CommandManager {
    private _systems: string[] = Array.of();
    private _slashCommands: Collection<string, SlashCommand> = new Collection();
    private _contextCommands: Collection<string, ContextCommand> = new Collection();

    private client: Lorra;
    constructor(client: Lorra) {
        this.client = client;
        this.initialise()
            .then(() => this.deploy())
            .catch((reason) => Bot.logger.error(reason))
            .finally(() => Bot.logger.test("✅ Registered Commands!"));
    }

    async initialise(dir: string = 'systems/'): Promise<void> {
        const cmdPath = path.join(__dirname, `../${dir}`);
        const files = await fs.readdir(cmdPath);
        for(const file of files) {
            const filePath = path.join(cmdPath, file);
            const stat = await fs.lstat(filePath);
            if(stat.isDirectory()) {
                this._systems.push(file);
                return await this.initialise(path.join(dir, file));
            }
            if(!file.endsWith(".ts") && !file.endsWith(".js")) return;
            const { default: command } = await import(filePath);
            const cmd = new command();
            switch (true) {
                case cmd instanceof SlashCommand:
                    var slashCmd = (cmd as SlashCommand);
                    this._slashCommands.set(slashCmd.getSlashCommandData().name, slashCmd);
                    break;
                case cmd instanceof ContextCommand:
                    var contextCmd = (cmd as ContextCommand);
                    this._contextCommands.set(contextCmd.getCommandData().name, contextCmd);
                    break;
            }
        }
    }

    /**
     * Deploy all commands to the discord api.
     */
    async deploy() {
        const guild = this.client.guilds.cache.get(process.env.TEST__GUILD!);
        guild?.commands.set([]);
        this.client.application?.commands.set([]);
        const commands: Collection<RegistrationType, RESTPostAPIApplicationCommandsJSONBody[]> = new Collection();
        // Filter commands to guild & global
        this._slashCommands.forEach((cmd) => {
            var regType = cmd.getRegistrationType();
            if(!commands.get(regType)) commands.set(regType, Array.of());
            commands.get(regType)?.push(cmd.getSlashCommandData().toJSON());
        });
        this._contextCommands.forEach((cmd) => {
            var regType = cmd.getRegistrationType();
            if(!commands.get(regType)) commands.set(regType, Array.of());
            commands.get(regType)?.push(cmd.getCommandData().toJSON());
        });
        // REST API connection
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);
        // Deploy global commands
        if(commands.get(RegistrationType.GLOBAL)) {
            await rest.put(Routes.applicationCommands(process.env.APP__ID!), 
                { body: commands.get(RegistrationType.GLOBAL) }
            );
        }
        // Deploy guild only commands
        await rest.put(Routes.applicationGuildCommands(process.env.APP__ID!, process.env.TEST__GUILD!), 
            { body: [] }
        );
        if(commands.get(RegistrationType.GUILD)) {
            await rest.put(Routes.applicationGuildCommands(process.env.APP__ID!, process.env.TEST__GUILD!), 
                { body: commands.get(RegistrationType.GUILD) }
            );
        }
    }

    get systems(): string[] { return this._systems; }
    get slashCommands(): Collection<string, SlashCommand> { return this._slashCommands; }
    get contextCommands(): Collection<string, ContextCommand> { return this._contextCommands; }
}