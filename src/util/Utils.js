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
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(path.join(__filename, '../'));

/**
 * 
 */
export default class Utils {
    /**
     * @depricated
     * @param {string} path
     * @param {string} lang 
     * @todo Use YAML instead of json
     */
    static async translate(content, lang) {
        const json = await JSON.parse(fs.readFileSync(`./lang/${lang}.json`));
        var search = content.split(".");
        console.log(search[0])
        return json[search[0]];
    }
}