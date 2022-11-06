import { ButtonInteraction } from "discord.js";
import { ComponentIds } from "../../../util/Enums";
import { ComponentHandler } from "../../../structures";
import FunService from "../FunService";

export default class TODHandler extends ComponentHandler {
    constructor() {
        super();
        this.handleButtonIds(ComponentIds.TodButton);
    }

    public handleButton(buttonInteraction: ButtonInteraction) {
        const service = new FunService();
        service.handleTod(buttonInteraction);
    }
}