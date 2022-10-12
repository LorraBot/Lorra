'use strict';

require('dotenv').config();
require('reflect-metadata');

const Lorra = require("./client/Lorra");
const { IntentsBitField } = require("discord.js");
const IntentFlags = IntentsBitField.Flags;

const client = new Lorra({
    intents: [
        IntentFlags.Guilds,
        IntentFlags.GuildBans,
        IntentFlags.GuildInvites,
        IntentFlags.GuildMessages,
        IntentFlags.MessageContent
    ],
    ws: { version: '10' }
});

client.login(process.env.TOKEN);