'use strict';

const fs = require("fs");
const path = require("path");
const BaseEvent = require('../structures/BaseEvent');

/**
 * Handles & Registers all events
 */
class EventManager {
    /**
     * @param {Lorra} client 
     */
    constructor(client) {
        this.client = client;

        /**
         * Initialize all the events
         */
        this.initialize();
    }
    /**
     * Initialize the events
     * @param {string} dir
     */
    initialize(dir = "./events/") {
        const eventsPath = path.join(__dirname, `../${dir}`);
        const files = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
        for (const file of files) {
            const filePath = path.join(eventsPath, file);
            const Event = require(filePath);
            if (!Event instanceof BaseEvent) return console.log(`Filed to load ${file}`);
            const ev = new Event();
            this.client.on(ev.name, ev.execute.bind(ev, this.client));
        }
    }
}

module.exports = EventManager;