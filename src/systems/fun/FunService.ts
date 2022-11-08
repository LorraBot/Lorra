import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, ComponentBuilder, EmbedBuilder } from "discord.js";
import Utils from "../../util/Utils";
import { BotColor, ComponentIds } from "../../util/Enums";
import { ComponentIdBuilder } from "../../structures";

export default class FunService {
    constructor() {}

    public handleTod(chatOrButtonInteraction: ChatInputCommandInteraction|ButtonInteraction) {
        const truthBtn = new ButtonBuilder()
            .setCustomId(ComponentIdBuilder.build(ComponentIds.TodButton, "truth"))
            .setLabel('Truth')
            .setStyle(ButtonStyle.Success);
        const dareBtn = new ButtonBuilder()
            .setCustomId(ComponentIdBuilder.build(ComponentIds.TodButton, "dare"))
            .setLabel('Dare')
            .setStyle(ButtonStyle.Danger);
        const randomBtn = new ButtonBuilder()
            .setCustomId(ComponentIdBuilder.build(ComponentIds.TodButton, "random"))
            .setLabel('Random')
            .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(truthBtn, dareBtn, randomBtn);

        var t;
        switch(true) {
            case chatOrButtonInteraction instanceof ChatInputCommandInteraction:
                t = "random";
                break;
            default:
                t = ComponentIdBuilder.split((chatOrButtonInteraction as ButtonInteraction).customId)[1];
        }
        
        const types = ["truth", "dare"];
        if(t === "random") t = types[Math.floor(Math.random() * types.length)];
        const route = `https://api.truthordarebot.xyz/v1/${t}`;

        const TODEmbed = new EmbedBuilder();
        Utils.request(route).then(async (res) => {
            TODEmbed.setAuthor({
                    name: `Requested by ${chatOrButtonInteraction.user.username}`,
                    iconURL: chatOrButtonInteraction.user.displayAvatarURL()})
                .setTitle(res.question)
                .setColor(res.type === "DARE" ? BotColor.Red : BotColor.Blue)
                .setFooter({ text: `${res.type} |${res.rating} • ID: ${res.id}`});
            return await chatOrButtonInteraction.reply({ embeds: [TODEmbed], components: [row] });
        }).catch(async (reason) => 
            await chatOrButtonInteraction.reply({ 
                embeds: [TODEmbed.setTitle(String(reason)).setColor('DarkRed')], 
                ephemeral: true 
            })
        );
    }

    public handleMeme(interaction: ChatInputCommandInteraction) {
        const baseUrl = "https://reddit.com/r/memes/random/.json";
        const memeBed = new EmbedBuilder();
        Utils.request(baseUrl).then(async ([list]) => {
            const [post] = list.data.children;

            var memeTitle = post.data.title;
            var memeSubreddit = post.data.subreddit_name_prefixed;
            var memeUrl = `https://reddit.com${post.data.permalink}`;
            var memeImage = post.data.url;
            var memeUpvotes = post.data.ups;
            var memeNumComments = post.data.num_comments;

            memeBed.setTitle(`${memeTitle}`)
                .setAuthor({ name: memeSubreddit })
                .setURL(memeUrl)
                .setColor('Random')
                .setFooter({ text: `⬆️${memeUpvotes} | ${memeNumComments}💬` })
                .setImage(memeImage)
                .setTimestamp();
            await interaction.reply({ embeds: [memeBed] })
        }).catch(async (reason) => 
            await interaction.reply({ 
                embeds: [memeBed.setTitle(reason).setColor('DarkRed')], 
                ephemeral: true
            })
        );
    }

    public handleRps() {
        
    }
}