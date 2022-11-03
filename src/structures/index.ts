import EventBase from "./EventBase";
import ILogger from "./ILogger";

// -- Command Interfaces --
import { RegistrationType } from "./interactions/RegistrationType";
import SlashCommand from "./interactions/slashcommand/SlashCommand";
import SlashCommandSubCommand from "./interactions/slashcommand/SlashCommandSubCommand";
import ContextCommand from "./interactions/contextcommand/ContextCommand";
import MessageContextCommand from "./interactions/contextcommand/MessageContextCommand";
import UserContextCommand from "./interactions/contextcommand/UserContextCommand";
// ----

/**
 * Exports all globally used interfaces
 */
export {
    EventBase,
    ILogger,
    // Enums
    RegistrationType,
    // SlashCommand Interfaces
    SlashCommand,
    SlashCommandSubCommand,
    // ContextCommand Interfaces
    ContextCommand,
    MessageContextCommand,
    UserContextCommand
};