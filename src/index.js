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
import "dotenv/config";
import "reflect-metadata";

import { ShardingManager } from 'discord.js';
import MainLogger from "./util/MainLogger.js";
import Utils from "./util/Utils.js";

async function bootstrap() {
    const shardingManager = new ShardingManager('src/bot.js', { token: process.env.TOKEN });
    shardingManager.on('shardCreate', (shard) => {
        MainLogger.getLogger().info(`Loaded shard [${shard.id}]`);
    });
    shardingManager.spawn();
}

void bootstrap();