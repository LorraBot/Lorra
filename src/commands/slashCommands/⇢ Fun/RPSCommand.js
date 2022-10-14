'use strict';

const Lorra = require('../../../client/Lorra');
const SlashCommand = require('../../../structures/command/SlashCommand');
const CommandStatus = require('../../../util/CommandStatus');
const ColorUtils = require('../../../util/ColorUtils');
const crypto = require('node:crypto');
const ms = require('ms');
const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType
} = require('discord.js');

const options = ['rock', 'paper', 'scissors'];

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

/**
 * Test your chances with Rock, Paper, Scissors
 */
class RPSCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('rps')
            .setDescription('🪨Rock.. 📃Paper.. ✂️Scissors.. SHOOT!')
            .toJSON(), CommandStatus.Testing);
    }

    /**
     * @param {Lorra} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        // Choices
        var botChoiceObj = this.#encrypt(options[Math.floor(Math.random() * options.length)]);
        var botChoiceHash = botChoiceObj.content;
        console.log(botChoiceObj);
        // Create the message embed
        const embed = new EmbedBuilder().setColor(ColorUtils.Invisible);

        // -- Components --
        const RockBtn = new ButtonBuilder().setEmoji('🪨').setLabel('Rock').setCustomId('rock').setStyle(ButtonStyle.Danger);
        const PaperBtn = new ButtonBuilder().setEmoji('📃').setLabel('Paper').setCustomId('paper').setStyle(ButtonStyle.Primary);
        const ScissorsBtn = new ButtonBuilder().setEmoji('✂️').setLabel('Scissors').setCustomId('scissors').setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(RockBtn, PaperBtn, ScissorsBtn);
        // ----

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🪨Rock.. 📃Paper.. ✂️Scissors.. SHOOT! 💥')
                    .setAuthor({ iconURL: interaction.user.avatarURL(), name: "*Expires: 1m*" })
                    .setDescription('Select a button to choose your answer.\n*Session will expire in 1m*')
                    .addFields({ name: 'Notice', value: "*To ensure everything is fair the bot generates a response before user input and enters a hash (hidden) version of the response in the footer.*" })
                    .setFooter({ text: `*${botChoiceHash}*` })
            ],
            components: [row]
        });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, filter, time: ms('1m'), maxUsers: 1 });

        collector.on('end', async (collection) => {
            // -- Deactivate Buttons --
            row.components.forEach((value) => value.setDisabled(true));
            interaction.editReply({ components: [row] });
            //----
            // Decode the bots answer
            const botChoice = this.#decode(botChoiceObj);
            console.log(botChoice);
            const userChoice = collection.get(collection.firstKey()).component.customId;
            // Checks if the Bot's and User's reaction are the same
            if (userChoice === botChoice) embed.setTitle(`Uh OH! Looks like we both chose ${uChoice}.`)
                .setDescription('Run the command again and see what your outcome is :D')
                .setColor(ColorUtils.Invisible);

            // Choice Decider
            if (userChoice === 'rock' && botChoice === 'scissors') {
                embed.setTitle('Wowwww! You WON! Congratulations 🎉')
                    .setDescription("🪨Rock **CRUSHES** ✂️Scissors!");
            } else if (userChoice === 'paper' && botChoice === 'rock') {
                embed.setTitle('Wowwww! You WON! Congratulations 🎉')
                    .setDescription("📃Paper **COVERS** 🪨Rock!");
            } else if (userChoice === 'scissors' && botChoice === 'paper') {
                embed.setTitle('Wowwww! You WON! Congratulations 🎉')
                    .setDescription("✂️Scissor's cut 📃Paper!");
            } else {
                embed.setTitle('Oh Nooooo! Looks like you lost!')
                    .setDescription(`I chose \`${botChoice}\`. Let's play again :D`);
            }
            // Return the interation
            return await interaction.followUp({ embeds: [embed] });
        });
    }

    /**
     * @param {string} value 
     * @returns {JSON} encoded value 
     */
    #encrypt(value) {
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(value);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), content: encrypted.toString('hex') };
    }

    /**
     * @param {JSON} obj 
     * @returns {string} Actual value
     */
    #decode(obj) {
        let iv = Buffer.from(obj.iv, 'hex');
        let encryptedText = Buffer.from(obj.content, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}

module.exports = RPSCommand;