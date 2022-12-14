/** 
 *  Copyright (C) 2022 OoP1nk
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 * 
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 */

import path from 'path';
import fs from 'fs/promises';
import Lorra from '../client/Lorra';
import { ComponentHandler, ComponentIdBuilder, ContextCommand, SlashCommand } from '../structures';
import Bot from '../bot';
import { 
    ButtonInteraction, 
    ChatInputCommandInteraction, 
    Collection, 
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction, 
    REST, 
    RESTPostAPIApplicationCommandsJSONBody, 
    Routes, 
    SelectMenuInteraction, 
    UserContextMenuCommandInteraction 
} from 'discord.js';
import ms from 'ms';
import { RegistrationType } from '../util/Enums';

/**
 * The Interaction class, that finds, registers and handles all Commands and other Interactions.
 */
export default class InteractionManager {

    /**
     * An index of all {@link SlashCommand.Command}s
     */
    private _slashCommandIndex: Collection<string, SlashCommand.Command> = new Collection();

    /**
     * An index of all {@link SlashCommand.Subcommand}s
     */
    private _subcommandIndex: Collection<string, SlashCommand.Subcommand> = new Collection();

    /**
     * An index of all {@link ContextCommand.Message}s
     */
    private _messageContextIndex: Collection<string, ContextCommand.Message> = new Collection();

    /**
     * An index of all {@link ContextCommand.User}s
     */
    private _userContextIndex: Collection<string, ContextCommand.User> = new Collection();

    /**
     * An index of all {@link ComponentHandler}s
     */
    private _handlerIndex: Collection<string, ComponentHandler> = new Collection();

    private commands: Collection<RegistrationType, RESTPostAPIApplicationCommandsJSONBody[]> = new Collection();
    private client: Lorra;

    /**
     * Constructs a new {@link InteractionManager}
     * @param client The {@link Lorra} instance
     */
    constructor(client: Lorra) {
        this.client = client;

        this.findSlashCommands();
        this.findContextCommands();

        this.findInteractionHandlers();
    }

    /**
     * Register all commands to the DiscordAPI
     * (*) SlashCommands
     * (*) ContextCommands
     */
    public registerInteractions() {
        this.client.application?.commands.set([]);
        this.client.guilds.cache.get(process.env.TEST__GUILD!)?.commands.set([]);
        setTimeout(async () => {
            const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

            /**
             * Publish all global commands to the discord API
             */
            await rest.put(Routes.applicationCommands(process.env.APP__ID!), { 
                body: this.commands.get(RegistrationType.GLOBAL) 
            }).then(() => Bot.logger.info("Successfully loaded global commands."));

            /**
             * Publish all guild-only commands to the discord API
             */
            await rest.put(Routes.applicationGuildCommands(process.env.APP__ID!, process.env.TEST__GUILD!), { 
                body: this.commands.get(RegistrationType.GUILD) 
            }).then(() => Bot.logger.info("Successfully loaded guild-only commands."));
        }, ms('30s'));
    }

    /**
     * Adds a command to the command index base on {@link RegistrationType}
     * @param command Command to register
     * @param type Type of which the command will be registered
     */
    private addCommand(command: SlashCommand.Command|ContextCommand.Command, type: RegistrationType) {
        if(!this.commands.get(type)) this.commands.set(type, Array.of());
        var commandData;
        switch(true) {
            case command instanceof SlashCommand.Command:
                commandData = (command as SlashCommand.Command).getSlashCommandData();
                this.slashCommandIndex.set(commandData.name, (command as SlashCommand.Command));
                break;
            case command instanceof ContextCommand.Command:
                commandData = (command as ContextCommand.Command).getCommandData();
                break;
            default:
                commandData = null;
        }
        if(!commandData) return;
        this.commands.get(type)?.push(commandData.toJSON());
    }

    /**
     * Find and Register all {@link SlashCommand}s
     * @param dir Location of {@link SlashCommand}s
     */
    private async findSlashCommands(dir: string = "../systems/"): Promise<void> {
        const basePath = path.join(__dirname, dir);
        const files = await fs.readdir(basePath);
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const stat = await fs.lstat(filePath);
            if (stat.isDirectory()) this.findSlashCommands(path.join(dir, file));
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                const { default: Command } = await import(filePath);
                const command = new Command();
                if(command instanceof SlashCommand.Command) {
                    this.addCommand(command, command.getRegistrationType());
                    for(const c of command.getSubcommands()) {
                        var name = ComponentIdBuilder.build(command.getSlashCommandData().name, c.getSubcommandData().name);
                        this._subcommandIndex.set(name, c);
                    }
                }
            }
        }
    }

    /**
     * Find and Registers all {@link ContextCommand}s
     * @param dir Location of {@link ContextCommand}s
     */
    private async findContextCommands(dir: string = "../systems/"): Promise<void> {
        const basePath = path.join(__dirname, dir);
        const files = await fs.readdir(basePath);
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const stat = await fs.lstat(filePath);
            if (stat.isDirectory()) this.findContextCommands(path.join(dir, file));
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                const { default: Command } = await import(filePath);
                const command = new Command();
                if(command instanceof ContextCommand.Command) {
                    this.addCommand(command, command.getRegistrationType());
                    switch(true) {
                        case command instanceof ContextCommand.User:
                            this._userContextIndex.set(command.getCommandData().name, command as ContextCommand.User);
                            break;
                        case command instanceof ContextCommand.Message:
                            this._messageContextIndex.set(command.getCommandData().name, command as ContextCommand.Message);
                            break;
                    }
                }
            }
        }
    }

    /**
     * Finds and Registers all {@link ComponentHandler}s
     * @param dir Location of {@link ComponentHandler}s
     */
    private async findInteractionHandlers(dir: string = "../systems/"): Promise<void> {
        const basePath = path.join(__dirname, dir);
        const files = await fs.readdir(basePath);
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const stat = await fs.lstat(filePath);
            if (stat.isDirectory()) this.findInteractionHandlers(path.join(dir, file));
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                const { default: Handler } = await import(filePath);
                const handler = new Handler();
                if(handler instanceof ComponentHandler) {
                    this.putComponentHandlers(handler);
                }
            }
        }
    }

    /**
     * Register all {@link ComponentHandler}s
     * @param handler {@link ComponentHandler} instance
     * @returns 
     */
    private putComponentHandlers(handler?: ComponentHandler): void {
        if(handler === null) return;
        handler?.getHandleButtonIds().forEach(s => this._handlerIndex.set(s, handler));
        handler?.getHandleSelectMenuIds().forEach(s => this._handlerIndex.set(s, handler));
        handler?.getHandleModalIds().forEach(s => this._handlerIndex.set(s, handler));
    }

    /**
     * Handle all {@link ChatInputCommandInteraction}s
     * @param interaction SlashCommand interaction response
     */
    public handleSlashCommand(interaction: ChatInputCommandInteraction) {
        const commandName: string = interaction.commandName;
        if(this._slashCommandIndex.has(commandName)) {
            this._slashCommandIndex.get(commandName)?.execute(this.client, interaction);
            if(interaction.options.getSubcommand())
                this._subcommandIndex.get(
                    ComponentIdBuilder.build(commandName, interaction.options.getSubcommand()))
                    ?.execute(this.client, interaction);
        }
    }

    /**
     * Handle all {@link UserContextMenuCommandInteraction}s
     * @param interaction UserContext interaction response
     */
    public handleUserContextCommand(interaction: UserContextMenuCommandInteraction) {
        var context: ContextCommand.User = this._userContextIndex.get(interaction.commandName)!;
        if(context === null) {
            // throw error
        } else {
            context.execute(interaction);
        }
    }

    /**
     * Handle all {@link MessageContextMenuCommandInteraction}s
     * @param interaction MessageContext interaction response
     */
    public handleMessageContextCommand(interaction: MessageContextMenuCommandInteraction) {
        var context: ContextCommand.Message = this._messageContextIndex.get(interaction.commandName)!;
        if(context === null) {
            //throw error
        } else {
            context.execute(interaction);
        }
    }

    /**
     * Handle all {@link ButtonInteraction}s
     * @param interaction Button interaction response
     */
    public handleButton(interaction: ButtonInteraction) {
        var component: ComponentHandler = this._handlerIndex.get(ComponentIdBuilder.split(interaction.customId)[0])!;
        if(component === null) {
            Bot.logger.warn("Button with the id %id% could not be found.".replace("%id%", interaction.customId))
        } else {
            component.handleButton(interaction);
        }
    }

    /**
     * Handle all {@link SelectMenuInteraction}s
     * @param interaction SelectMenu interaction response
     */
    public handleSelectMenu(interaction: SelectMenuInteraction) {
        var component: ComponentHandler = this._handlerIndex.get(ComponentIdBuilder.split(interaction.customId)[0])!;
        if(component === null) {
            Bot.logger.warn("Select menu with the id %id% could not be found.".replace("%id%", interaction.customId));
        } else {
            component.handleSelectMenu(interaction);
        }
    }

    /**
     * Handle all {@link ModalSubmitInteraction}s
     * @param interaction Modal interaction response
     */
    public handleModal(interaction: ModalSubmitInteraction) {
        var modal: ComponentHandler = this._handlerIndex.get(ComponentIdBuilder.split(interaction.customId)[0])!;
        if(modal === null) {
            Bot.logger.warn("Modal with the id %id% could not be found.".replace("%id%", interaction.customId));
        } else {
            modal.handleModal(interaction);
        }
    }

    get slashCommandIndex(): Collection<string, SlashCommand.Command> { return this._slashCommandIndex; }
    get userContextIndex(): Collection<string, ContextCommand.User> { return this._userContextIndex; }
    get messageContextIndex(): Collection<string, ContextCommand.Message> { return this._messageContextIndex; }
}