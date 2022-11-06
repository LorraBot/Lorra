import chalk from "chalk";
import { ILogger } from "../structures";
import { LogLevel } from "./Enums";

export default class Logger implements ILogger {
    private log = console.log;

    private static _instance: Logger = new Logger();
    public static get instance(): Logger {
        return this._instance;
    }

    info(message: any): void {
        return this.log(this.getFormat(LogLevel.INFO, message));
    }
    test(message: any): void {
        return this.log(this.getFormat(LogLevel.TEST, message));
    }
    error(message: any): void {
        return this.log(this.getFormat(LogLevel.ERROR, message));
    }
    warn(message: any): void {
        return this.log(this.getFormat(LogLevel.WARN, message));
    }

    /**
     * private function to format output
     */
    private getFormat(level: LogLevel, message: any): string {
        const format = "(%date%) [%level%]: %message%";
        const fdate = new Date(Date.now()).toUTCString();
        const color = { "INFO": 'blue', "TEST": 'green', "ERROR": 'redBright',"WARN": "red"}[level];
        return chalk.gray(format)
            .replace("%date%", chalk.yellow(fdate))
            .replace("%level%", chalk`{${color} ${level}}`)
            .replace("%message%", chalk`{${color} ${message}}`);
    }
}