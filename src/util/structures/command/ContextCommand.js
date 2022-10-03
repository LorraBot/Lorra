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

import BaseCommand from "./BaseCommand.js";
import pkg, { ContextMenuCommandInteraction, ApplicationCommandType } from "discord.js";

const { RESTPostAPIApplicationCommandsJSONBody } = pkg;

export default class ContextCommand extends BaseCommand {
    /**
     * @param {string} name 
     * @param {RESTPostAPIApplicationCommandsJSONBody} command 
     */
    constructor(name, command) {
        super(name, command);
    }
    get type() { return ApplicationCommandType.User }
    /**
     * @param {Client} client 
     * @param {ContextMenuCommandInteraction} interaction 
     * @return {Promise<void>}
     */
    async exec(client, interaction) { }
}