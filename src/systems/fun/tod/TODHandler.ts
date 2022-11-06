import { ButtonInteraction } from "discord.js";
import { ButtonIds } from "../../../util/Enums";
import { ComponentHandler } from "../../../structures";
import FunService from "../FunService";

export default class TODHandler extends ComponentHandler {
    constructor() {
        super();
        this.handleButtonIds(ButtonIds.TOD);
    }

    public handleButton(buttonInteraction: ButtonInteraction) {
        const service = new FunService();
        service.handleTod(buttonInteraction);
    }
}