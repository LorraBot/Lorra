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

import { Client, IntentsBitField } from 'discord.js';
import CommandManager from './managers/CommandManager.js';
import EventManager from './managers/EventManager.js';
import MainLogger from './util/MainLogger.js';

export default class Bot {
    _client;
    _eventManager;
    static _instance = new Bot();
    static getInstance() { return this._instance; }
    static main() {
        this._client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildBans,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMessageReactions,
                IntentsBitField.Flags.MessageContent
            ]
        });
        this._eventManager = new EventManager();
        this._commandManager = new CommandManager();
        this._client.login(process.env.TOKEN);
    }
    /**
     * @return {Client} Discord client
     */
    static get client() { return this._client; }

    static get logger() { return MainLogger.getLogger(); }
}

void Bot.main();