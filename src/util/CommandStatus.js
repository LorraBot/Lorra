'use strict';

const { createEnum } = require('./Enums');

/**
 * @typedef {Object} CommandStatus
 * @property {number} Public
 * @property {number} Testing
 */

/**
 * @type {CommandStatus}
 * @ignore
 */
module.exports = createEnum([
    'Public',
    'Testing'
]);