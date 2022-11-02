export default interface ILogger {
    info(message: any, color?: string): void;
    test(message: any, color?: string): void;
    shard(message: any, color?: string): void;
    error(message: any, color?: string): void;
    critical(message: any, color?: string): void;
}