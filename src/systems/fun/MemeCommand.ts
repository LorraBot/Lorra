import client from "../../client/client";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../structures";
import Commands from "../../util/Commands";
import { default as axios } from 'axios';
import { BotColor } from "../../util/Enums";

export default class MemeCommand extends SlashCommand {
    constructor() {
        super();
        this.setSlashCommandData(Commands.slash('meme', 'Memeeeeessss'));
    }

    public async execute(client: client, interaction: ChatInputCommandInteraction) {
        const baseUrl = "https://reddit.com/r/memes/random/.json";
        const Memebed = new EmbedBuilder().setColor(BotColor.Invisible);
        await axios.get(baseUrl)
        .then(async (res) => {
            const [list] = res.data;
            const [post] = list.data.children;

            var memeTitle = post.data.title;
            var memeSubreddit = post.data.subreddit_name_prefixed;
            var memeUrl = `https://reddit.com${post.data.permalink}`;
            var memeImage = post.data.url;
            var memeUpvotes = post.data.ups;
            var memeNumComments = post.data.num_comments;

            Memebed.setTitle(`${memeTitle}`)
                .setAuthor({ name: memeSubreddit })
                .setURL(memeUrl)
                .setColor('Random')
                .setFooter({ text: `⬆️${memeUpvotes} | ${memeNumComments} Comments` })
                .setImage(memeImage)
                .setTimestamp()
            await interaction.reply({ embeds: [Memebed] })
        }).catch(async (reason) => await interaction.reply({ 
            embeds: [Memebed.setTitle('Error Occured').setDescription(reason)], 
            ephemeral: true 
        }));
    }
}