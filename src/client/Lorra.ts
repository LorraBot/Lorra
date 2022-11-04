import Bot from "../bot";
import { Client, ClientOptions } from "discord.js";
import ms from "ms";
import { DataSource } from "typeorm";
import { GuildSettingsManager, CommandManager, EventManager } from "../managers";
import { entities } from "../util/typeorm";

export default class Lorra extends Client {
    private _dataSource: DataSource;
    private _commandManager: CommandManager;
    private _eventManager: EventManager;
    private _guildSettingsManager: GuildSettingsManager;

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
            synchronize: true,
            entities
        });
        this._dataSource.initialize()
            .then(async () => Bot.logger.test("Initialised connection to database."))
            .catch((reason) => Bot.logger.error(reason))
        
        /**
         * Register guild settings
         */
        this._guildSettingsManager = new GuildSettingsManager(this);

        /**
         * Register events
         */
        this._eventManager = new EventManager(this);

        /**
         * Register commands
         */
        this._commandManager = new CommandManager(this);
    }

    get dataSource(): Promise<DataSource> { 
        if(this._dataSource.isInitialized) return Promise.resolve(this._dataSource);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(this._dataSource.isInitialized) resolve(this._dataSource);
                else reject("Failed to create connection with database");
            }, ms('5s'));
        });
    }

    /**
     * Managers
     */
    get guildSettingsManager(): GuildSettingsManager { return this._guildSettingsManager; }
    get eventManager(): EventManager { return this._eventManager; }
    get commandManager(): CommandManager { return this._commandManager; }
}
