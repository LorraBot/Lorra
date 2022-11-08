import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, ComponentBuilder, ComponentType, EmbedBuilder } from "discord.js";
import Utils from "../../util/Utils";
import { BotColor, ComponentIds } from "../../util/Enums";
import { ComponentIdBuilder } from "../../structures";
import ms from "ms";

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

    public async handleRps(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user", false);
        // -- Components --
        const RBtn = new ButtonBuilder()
            .setCustomId(ComponentIdBuilder.build(ComponentIds.RpsButton, "rock"))
            .setEmoji('🪨')
            .setLabel('Rock')
            .setStyle(ButtonStyle.Danger);
        const PBtn = new ButtonBuilder()
            .setCustomId(ComponentIdBuilder.build(ComponentIds.RpsButton, "paper"))
            .setEmoji('📃')
            .setLabel('Paper')
            .setStyle(ButtonStyle.Primary);
        const SBtn = new ButtonBuilder()
            .setCustomId(ComponentIdBuilder.build(ComponentIds.RpsButton, "scissors"))
            .setEmoji('✂️')
            .setLabel('Scissors')
            .setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(RBtn, PBtn, SBtn);
        // ----

        await interaction.reply({
            content: `${user ? `${user}` : ""}`,
            embeds: [
                new EmbedBuilder()
                    .setTitle('Rock..Paper..Scissors.. SHOOT!!')
                    .setColor(BotColor.Invisible)
                    .setDescription(`*Click a button to enter your response*`)
            ],
            components: [row]
        });

        var userResponse: string;
        var targetOrBotResponse: string|null;

        const filter = (i:ButtonInteraction) => i.user.id === interaction.user.id||i.user.id===user?.id;
        const collector = interaction.channel?.createMessageComponentCollector({
            componentType: ComponentType.Button,
            maxUsers: user ? 2 : 1,
            time: ms("1m"),
            filter
        });

        collector?.on('collect', (i) => {
            if(!i.customId.includes(ComponentIds.RpsButton)) return;
            var customId = ComponentIdBuilder.split(i.customId)[1];
            i.reply({ content: `You have selected: ${i.component.label}`, ephemeral: true });
            if(user) {
                i.user.id===interaction.user.id ? userResponse=customId : targetOrBotResponse=customId;
            } else userResponse=customId;
        });

        collector?.on('end', async () => {
            var responses = ["rock", "paper", "scissors"];
            if(!user) targetOrBotResponse = responses[Math.floor(Math.random() * responses.length)];
            // -- End Game --
            row.components.forEach((value: any) => value.setDisabled(true));
            const nEmbed = new EmbedBuilder()
                .setTitle('Session expired')
                .setColor(BotColor.Red)
                .setTimestamp();
            // await interaction.editReply({ content: '', embeds: [nEmbed], components: [row] })
            // ----
            var resEmbed = new EmbedBuilder().setColor('Yellow');
            if(userResponse === targetOrBotResponse) 
                return void await interaction.editReply({ embeds: [resEmbed.setTitle('Looks like it was a draw 🤷')] ,components: [row] });
            var u = user ? `${user.username}` : `${interaction.client.user.username}`
            if (userResponse === 'rock' && targetOrBotResponse === 'paper'||
            userResponse === 'paper' && targetOrBotResponse === 'scissors'||
            userResponse === 'scissors' && targetOrBotResponse === 'rock') {
                resEmbed.setTitle(`🎉 ${u} has Won! 🎉`);
            } else { resEmbed.setTitle(`🎉 ${interaction.user.username} has Won! 🎉`); }
            return void await interaction.editReply({ embeds: [resEmbed], components: [row] });
        });
    }
}