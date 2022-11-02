import path from 'path';
import fs from 'fs';
import Bot from '../bot';
import { EventBase } from '../structures';
import Lorra from '../client/client';

export default class EventManager {
    private client: Lorra;

    constructor(client: Lorra) {
        this.client = client;
        this.initialise().finally(() => {
            Bot.logger.test('✅ Events Registered!', 'green')
        });
    }

    async initialise(dir: string = "events/") {
        const eventsPath = path.join(__dirname, `../${dir}`);
        const files = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js')||file.endsWith('.ts'));
        for (const file of files) {
            const filePath = path.join(eventsPath, file);
            const { default: Event } = require(filePath);
            if (Event !instanceof EventBase) return Bot.logger.error(`Filed to load ${file}`, 'red');
            const ev = new Event();
            this.client.on(ev.eventName, ev.execute.bind(ev, this.client));
        }
    }
}