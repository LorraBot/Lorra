import chalk from "chalk";
import { ILogger } from "../structures";
import { LogLevel } from "./Enums";

export default class Logger implements ILogger {
    private static _instance: Logger = new Logger();
    public static get instance(): Logger {
        return this._instance;
    }

    info(message: any, color: string = "white"): void {
        return console.log(this.getFormat(LogLevel.INFO)!.replace("%message%", chalk`{${color} ${message}}`));
    }
    test(message: any, color: string = "white"): void {
        return console.log(this.getFormat(LogLevel.TEST)!.replace("%message%", chalk`{${color} ${message}}`));
    }
    shard(message: any, color: string = "white"): void {
        return console.log(this.getFormat(LogLevel.SHARD)!.replace("%message%", chalk`{${color} ${message}}`));
    }
    error(message: any, color: string = "white"): void {
        return console.log(this.getFormat(LogLevel.ERROR)!.replace("%message%", chalk`{${color} ${message}}`));
    }
    critical(message: any, color: string = "white"): void {
        return console.log(this.getFormat(LogLevel.CRITICAL)!.replace("%message%", chalk`{${color} ${message}}`));
    }

    /**
     * private function to format majority of output
     */
    private format: string = `(%date%) [%level%]: %message%`;
    private getFormat(level: LogLevel): string|null {
        const fdate = new Date(Date.now()).toUTCString();
        var pformat = chalk.gray(this.format).replace("%date%", chalk.yellow(fdate));
        switch(level) {
            case LogLevel.INFO: {
                return pformat.replace("%level%", chalk.cyan("INFO"));
            }
            case LogLevel.TEST: {
                return pformat.replace("%level%", chalk.greenBright("TEST"));
            }
            case LogLevel.SHARD: {
                return pformat.replace("%level%", chalk.blue("SHARD"));
            }
            case LogLevel.ERROR: {
                return pformat.replace("%level%", chalk.red("ERROR"));
            }
            case LogLevel.CRITICAL: {
                return pformat.replace("%level%", chalk.redBright("CRITICAL"));
            }
        }
    }
}