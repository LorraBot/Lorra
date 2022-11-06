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
    SelectMenuInteraction, 
    UserContextMenuCommandInteraction 
} from 'discord.js';
import ms from 'ms';

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
     * Deploy all commands
     */
    public async registerInteractions() {}

    private async findSlashCommands(dir: string = "../systems/"): Promise<Set<SlashCommand.Command>> {
        var commands: Set<SlashCommand.Command> = new Set();
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
                    this._slashCommandIndex.set(command.getSlashCommandData().name, command);
                    commands.add(command);
                }
            }
        }
        return commands;
    }

    private async findContextCommands(dir: string = "../systems/"): Promise<Set<ContextCommand.Command>> {
        var commands: Set<ContextCommand.Command> = new Set();
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
                    commands.add(command);
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
        return commands;
    }

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

    private putComponentHandlers(handler?: ComponentHandler): void {
        if(handler === null) return;
        handler?.getHandleButtonIds().forEach(s => this._handlerIndex.set(s, handler));
        handler?.getHandleSelectMenuIds().forEach(s => this._handlerIndex.set(s, handler));
        handler?.getHandleModalIds().forEach(s => this._handlerIndex.set(s, handler));
    }

    public handleSlashCommand(interaction: ChatInputCommandInteraction) {
        const commandName: string = interaction.commandName;
        const req = this._slashCommandIndex.has(commandName) ? this._slashCommandIndex.get(commandName) : this._subcommandIndex.get(commandName);
        if(req === null) {
            // Throws error
        } else {
            if(this._slashCommandIndex.has(commandName)) {
                this._slashCommandIndex.get(commandName)?.execute(this.client, interaction);
            } else {
                this._subcommandIndex.get(commandName)?.execute(interaction);
            }
        }
    }

    public handleUserContextCommand(interaction: UserContextMenuCommandInteraction) {
        var context: ContextCommand.User = this._userContextIndex.get(interaction.commandName)!;
        if(context === null) {
            // throw error
        } else {
            context.execute(interaction);
        }
    }

    public handleMessageContextCommand(interaction: MessageContextMenuCommandInteraction) {
        var context: ContextCommand.Message = this._messageContextIndex.get(interaction.commandName)!;
        if(context === null) {
            //throw error
        } else {
            context.execute(interaction);
        }
    }

    public handleButton(interaction: ButtonInteraction) {
        var component: ComponentHandler = this._handlerIndex.get(ComponentIdBuilder.split(interaction.customId)[0])!;
        if(component === null) {
            Bot.logger.warn("Button with the id %id% could not be found.".replace("%id%", interaction.customId))
        } else {
            component.handleButton(interaction);
        }
    }

    public handleSelectMenu(interaction: SelectMenuInteraction) {
        var component: ComponentHandler = this._handlerIndex.get(ComponentIdBuilder.split(interaction.customId)[0])!;
        if(component === null) {
            Bot.logger.warn("Select menu with the id %id% could not be found.".replace("%id%", interaction.customId));
        } else {
            component.handleSelectMenu(interaction);
        }
    }

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