import { 
    ButtonInteraction, 
    ModalSubmitInteraction, 
    SelectMenuInteraction 
} from "discord.js";

/**
 * 
 */
export default abstract class ComponentHandler {
    private handledButtonIds: Array<string> = Array.of();
    private handledSelectMenuIds: Array<string> = Array.of();
    private handledModalIds: Array<string> = Array.of();
    private handleAutoComplete: boolean = false

    protected constructor() {}

    public isAutoCompleteHandling(): boolean {
        return this.handleAutoComplete;
    }

    public setAutoCompleteHandling(handleAutoComplete: boolean): void {
        this.handleAutoComplete = handleAutoComplete;
    }

    /**
     * Buttons
     */
    public getHandleButtonIds(): Array<string> {
        return this.handledButtonIds;
    }

    public handleButtonIds(...values: string[]): void {
        this.handledButtonIds = values;
    }

    public handleButton(buttonInteraction: ButtonInteraction) {}

    /**
     * Select Menus
     */
    public getHandleSelectMenuIds(): string[] {
        return this.handledSelectMenuIds;
    }

    public handleSelectMenuIds(...values: string[]): void {
        this.handledSelectMenuIds = values;
    }

    public handleSelectMenu(selectMenuInteraction: SelectMenuInteraction) {}

    /**
     * Modals
     */
    public getHandleModalIds(): string[] {
        return this.handledModalIds;
    }

    public handleModalIds(...values: string[]): void {
        this.handledModalIds = values;
    }

    public handleModal(modalInteraction: ModalSubmitInteraction) {}
}