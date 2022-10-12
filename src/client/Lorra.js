'use strict';

const { Client } = require("discord.js");
const { DataSource } = require("typeorm");
const CommandManager = require("../managers/CommandManager");
const EventManager = require("../managers/Eventmanager");
const { entities } = require("../util/typeorm");

/**
 * The main bot and where everything is accessed.
 * @extends {Client}
 */
class Lorra extends Client {
    /**
     * @param {import("discord.js").ClientOptions} options
     */
    constructor(options) {
        super(options);

        /**
         * Load data and cache connections
         */
        this.dataSource = new DataSource({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_DB,
            synchronize: true,
            entities,
            logging: ['info'],
            cache: {
                type: 'ioredis',
                options: {
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT),
                    username: process.env.REDIS_USER,
                    password: process.env.REDIS_PASS
                }
            }
        }).initialize();

        /**
         * All of the events
         * @type {EventManager}
         */
        this.eventManager = new EventManager(this);

        /**
         * Command Registry
         * @type {CommandManager}
         */
        this.commandManager = new CommandManager(this);
    }
}

module.exports = Lorra;