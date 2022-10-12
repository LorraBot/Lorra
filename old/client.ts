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
import { Client, ClientOptions } from "discord.js";
import { DataSource } from 'typeorm';
import CommandManager from "./managers/CommandManager";
import EventManager from "./managers/EventManager";
import MainLogger from "./util/MainLogger";
import { entities } from "./util/typeorm";

export default class Lorra extends Client {
    private _dataSource: Promise<DataSource>;
    private _eventManager: EventManager;
    private _commandManager: CommandManager;
    constructor(options: ClientOptions) {
        // Passes through default ClientOptions
        super(options);
        // -- Connect to database --
        this._dataSource = new DataSource({
            type: "mysql",
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT),
            database: process.env.MYSQL_DB,
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            synchronize: true,
            entities,
            cache: {
                type: "ioredis",
                options: {
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT),
                    username: process.env.REDIS_USER,
                    password: process.env.REDIS_PASS
                }
            }
        }).initialize();
        // ----
        // -- General --
        this._eventManager = new EventManager(this);
        this._commandManager = new CommandManager();
        // ----
    }

    // Logger
    get logger(): MainLogger { return MainLogger.getLogger(); }

    get dataSource(): Promise<DataSource> { return this._dataSource; }

    // -- Managers --
    get eventManager(): EventManager { return this._eventManager; }
    get commandManager(): CommandManager { return this._commandManager; }
    // ----
}