import EventBase from "./EventBase";
import ILogger from "./ILogger";

// -- Command Interfaces --
import ComponentIdBuilder from "./interactions/CompoentIdBuilder";
import { SlashCommand } from "./interactions/commands/SlashCommand";
import { ContextCommand } from "./interactions/commands/ContextCommand";
import ComponentHandler from "./interactions/commands/ComponentHandler";
// ----

/**
 * Exports all globally used interfaces
 */
export {
    EventBase,
    ILogger,
    // Interaction Interfaces
    ComponentIdBuilder,
    SlashCommand,
    ContextCommand,
    ComponentHandler
};