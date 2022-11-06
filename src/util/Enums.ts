/**
 * Command Regestration type
 */
export enum RegistrationType {
    GLOBAL,
    GUILD
}

/**
 * Different log levels for system logging
 */
export enum LogLevel {
    INFO = "INFO",
    TEST = "TEST",
    ERROR = "ERROR",
    WARN = "WARN"
}
/**
 * Different colors
 */
export enum BotColor {
    Invisible = 0x2F3136,
    Blue = 0x2C5F78,
    Red = 0x661c1e
}

/**
 * All button ids
 */
export enum ComponentIds {
    TodButton = "tod-button",
    RpsButton = "rps-button"
}