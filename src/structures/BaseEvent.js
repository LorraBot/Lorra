'use strict';

const Lorra = require("../client/Lorra");

/**
 * The base class for events
 * @abstract
 */
class BaseEvent {
    /**
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * @param {Lorra} client
     * @param {...any} args;
     * @returns {Promise<void>}
     */
    async execute(client, ...args) { }
}

module.exports = BaseEvent;