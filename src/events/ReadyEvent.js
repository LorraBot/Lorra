'use strict';

const Lorra = require('../client/Lorra');
const BaseEvent = require('../structures/BaseEvent');

/**
 * Class for when the ready event fires
 * @extends {BaseEvent}
 */
class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready');
    }

    /**
     * @param {Lorra} client
     */
    async execute(client) {

    }
}

module.exports = ReadyEvent;