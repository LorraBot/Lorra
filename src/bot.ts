import 'dotenv/config';
import 'reflect-metadata';

import { IntentsBitField } from "discord.js";
import Lorra from "./client/Lorra";
import Logger from './util/Logger';

export default class Bot {
    private static client: Lorra;
    public static async main(): Promise<void> {
        const IntentFlags = IntentsBitField.Flags;
        this.client = new Lorra({
            intents: [
                IntentFlags.Guilds,
                IntentFlags.GuildBans,
                IntentFlags.GuildInvites,
                IntentFlags.GuildMessages,
                IntentFlags.MessageContent
            ]
        });
        this.client.interactionManager.registerInteractions();
        this.client.login(process.env.TOKEN);
    }

    static get logger(): Logger { return Logger.instance; }
}

void Bot.main();