import { Client, ClientOptions } from "discord.js";
import ms from "ms";
import { DataSource } from "typeorm";
import { CommandManager, EventManager } from "../managers";
import Logger from "../util/Logger";
import { entities } from "../util/typeorm";

export default class Lorra extends Client {
    private _dataSource: Promise<DataSource>;
    private _commandManager: CommandManager;
    private _eventManager: EventManager;

    constructor(options: ClientOptions) {
        super(options);

        /**
         * Initialise database connection as well as 
         * cache server conection.
         */
        this._dataSource = new DataSource({
            type: 'mysql',
            host: process.env.MYSQL__HOST,
            username: process.env.MYSQL__USERNAME,
            password: process.env.MYSQL__PASSWORD,
            database: process.env.MYSQL__DB,
            entities,
            synchronize: true,
            cache: {
                alwaysEnabled: true,
                type: 'redis',
                duration: ms('1m'),
                options: {
                    url: process.env.REDIS__URL,
                    password: process.env.REDIS__PASS
                }
            }
        }).initialize();
        
        /**
         * Register events
         */
        this._eventManager = new EventManager(this);

        /**
         * Register commands
         */
        this._commandManager = new CommandManager(this);
    }

    get dataSource(): Promise<DataSource> { return this._dataSource; }

    /**
     * Managers
     */
    get eventManager(): EventManager { return this._eventManager; }
    get commandManager(): CommandManager { return this._commandManager; }
}
