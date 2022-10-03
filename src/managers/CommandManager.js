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
import { __dirname } from '../util/Utils.js';
import Bot from '../bot.js';
import BaseCommand from '../util/structures/command/BaseCommand.js';
import ms from 'ms';

export default class CommandManager {
    _slashCommandMap = new Collection();
    _contextMenuMap = new Collection();
    constructor() {
        this.register("./commands/").then(() => {
            setTimeout(() => {
                this.deploy();
            }, ms('10s'))
        })
    }
    async register(dir = "") {
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
            const stat = await fs.lstat(path.join(filePath, file));
            if (stat.isDirectory()) this.register(path.join(dir, file));
            if (file.endsWith('.js')) {
                const { default: Command } = await import(path.join('file://', filePath, file));
                const cmd = new Command();
                switch (cmd.type) {
                    case 1:
                        this._slashCommandMap.set(cmd.name, cmd.command);
                        break;
                    case 2:
                        this._contextMenuMap.set(cmd.name, cmd.command);
                        break;
                    /**
                     * @todo Message App Command
                     */
                    case 3:
                        break;
                    default:
                        return Bot.logger.error('Error loading command!');
                }
            }
        }
    }
    async deploy() {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        var slashCommands = Array.from(this._slashCommandMap.values());
    }
}