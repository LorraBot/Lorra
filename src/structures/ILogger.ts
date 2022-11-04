export default interface ILogger {
    info(message: any): void;
    test(message: any): void;
    shard(message: any): void;
    error(message: any): void;
}