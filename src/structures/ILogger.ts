export default interface ILogger {
    info(message: any): void;
    warn(message: any): void;
    error(message: any): void;
    test(message: any): void;
}