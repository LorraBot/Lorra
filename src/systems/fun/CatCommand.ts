import client from "../../client/client";
import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../structures";
import Commands from "../../util/Commands";
import { default as axios } from 'axios';
import ms from "ms";

export default class CatCommand extends SlashCommand {
    private _results: any;
    private _timeout: number|null = null;

    constructor() {
        super();
        this.setSlashCommandData(Commands.slash('cat', 'Cats!!'));
    }

    public async execute(client: client, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const baseUrl = "https://tenor.googleapis.com/v2/search";
        if(!this._timeout || this._timeout > Date.now()) {
            this._results = await axios.get(baseUrl, { params: { q: "cats", key: process.env.TENOR__API, limit: 64 } })
                .then((res) => res.data.results);
            this._timeout = Date.now() + ms('5m');
        }
        const obj = this._results[Math.floor(Math.random() * this._results.length)];
        var gif = obj.media_formats.gif.url;
        const response = new EmbedBuilder()
            .setColor(interaction.user.hexAccentColor || 'Random')
            .setTitle(obj.content_description)
            .setURL(gif)
            .setImage(gif)
        return await interaction.followUp({ embeds: [response] });
    }
}