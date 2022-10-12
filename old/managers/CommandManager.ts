/**
 * Watchdog is an open source discord.js bot.
 * Copyright (C) 2022  OoP1nk
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */
import { Collection, REST, Routes } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import ms from 'ms';
import ChatInputCommand from '../util/structures/command/ChatInputCommand';
import UserCommand from '../util/structures/command/UserCommand';
import MessageCommand from '../util/structures/command/MessageCommand';

export default class CommandManager {
    private _slashCommands = new Collection<string, ChatInputCommand>();
    private _userCommands = new Collection<string, UserCommand>();
    private _messageCommands = new Collection<string, MessageCommand>();
    // -- All commands for deployment
    private _commands = new Collection<boolean, Array<JSON>>();
    // --
    constructor() {
        this.registerChatInputCommands("./commands/ChatInput/").finally(() => {
            setTimeout(() => {
                this.deploy();
            }, ms('10s'))
        })
    }
    async registerChatInputCommands(dir = "") {
        const filePath = path.join(__dirname, '../', dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
            const stat = await fs.lstat(path.join(filePath, file));
            if (stat.isDirectory()) {
                this.registerChatInputCommands(path.join(dir, file));
            };
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                const { default: Command } = await import(path.join(filePath, file));
                const cmd = new Command();
                this._slashCommands.set(cmd.data.name, cmd);
                if (!this._commands.get(cmd.global)) this._commands.set(cmd.global, new Array());
                this._commands.get(cmd.global)?.push(cmd.data);
            }
        }
    }
    async deploy() {
        // -- Create REST API Connection --
        //      And deploy commands.
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN || "");
        if(this._commands.get(true)) {
            rest.put(
                Routes.applicationCommands(process.env.APP_ID || ""), 
                { 
                    body: this._commands.get(true) 
                }
            );
        }
        if(this._commands.get(false)) {
            rest.put(
                Routes.applicationGuildCommands(process.env.APP_ID || "", 
                process.env.TEST_GUILD|| ""), 
                { 
                    body: this._commands.get(false) 
                }
            );
        }
        // ----
    }

    get slashCommands() { return this._slashCommands; }
}