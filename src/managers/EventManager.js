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
import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Bot from '../bot.js';
import { __dirname } from '../util/Utils.js';

export default class EventManager {
    _events = new Collection();
    constructor() {
        this.register('./events/');
    }
    /**
     * @param {string} dir 
     */
    async register(dir = "") {
        let basePath = path.join(__dirname, dir);
        let files = fs.readdirSync(basePath).filter(file => file.endsWith(".js"));
        for (const file of files) {
            const filePath = path.join("file://", basePath, file);
            const { default: Event } = await import(filePath);
            const event = new Event();
            this._events.set(event.name, event);
            Bot.client.on(event.name, event.exec.bind(event, Bot.client))
        }
    }
}