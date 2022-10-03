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
import chalk from 'chalk';

export default class MainLogger {
    _format = `[${chalk.blue(new Date().toUTCString())}] [%type%]: %msg%`
    static _logger = new MainLogger();
    static getLogger() { return this._logger }

    /**
     * @param {string} message 
     */
    info(message) {
        return console.log(this._format.replace("%type%", chalk.cyan("INFO")).replace("%msg%", message));
    }
    /**
     * @param {string} message 
     */
    error(message) {
        return console.log(this._format.replace("%type%", chalk.red("ERROR")).replace("%msg%", message));
    }
    /**
     * @param {string} message 
     */
    critical(message) {
        return console.log(this._format.replace("%type%", chalk.redBright("CRITICAL")).replace("%msg%", message));
    }
}