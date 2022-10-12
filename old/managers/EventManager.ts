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
import Lorra from '../client';
import BaseEvent from '../util/structures/BaseEvent';

export default class EventManager {
    private client: Lorra;
    private _events = new Collection<string, BaseEvent>();
    constructor(client: Lorra) {
        this.client = client;
        this.register('./events/');
    }
    async register(dir = "") {
        let basePath = path.join(__dirname, '../', dir);
        let files = fs.readdirSync(basePath).filter(file => file.endsWith(".ts")||file.endsWith(".js"));
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const { default: Event } = await import(filePath);
            const event = new Event();
            this._events.set(event.name, event);
            this.client.on(event.name, event.exec.bind(event, this.client))
        }
    }
}