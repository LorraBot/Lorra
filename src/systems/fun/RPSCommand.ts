import Lorra from "../../client/Lorra";
import { ChatInputCommandInteraction, CacheType, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ButtonInteraction, ButtonComponent } from "discord.js";
import ms from "ms";
import { SlashCommand } from "../../structures";
import Commands from "../../util/Commands";
import { BotColor } from "../../util/Enums";

export default class RPSCommand extends SlashCommand.Command {
    constructor() {
        super();
        this.setSlashCommandData(Commands.slash("rps", "🪨Rock.. 📃Paper.. ✂️Scissors.. SHOOT!")
            .addUserOption(option => option.setName('user').setDescription('User to play RPS with.').setRequired(true))
        );
    }

    public async execute(client: Lorra, interaction: ChatInputCommandInteraction) {
        const results = new Collection();
        const user = interaction.options.getUser('user', true);

        if (interaction.user.id === user.id)
            return interaction.reply(
                {
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Oh Noo!")
                            .setDescription("You can't just play yourself. Find someone to play a game with and try again :D")
                            .setColor('Red')
                    ],
                    ephemeral: true
                });

        // -- Components --
        const RBtn = new ButtonBuilder().setEmoji('🪨').setLabel('Rock').setCustomId('rock').setStyle(ButtonStyle.Danger);
        const PBtn = new ButtonBuilder().setEmoji('📃').setLabel('Paper').setCustomId('paper').setStyle(ButtonStyle.Primary);
        const SBtn = new ButtonBuilder().setEmoji('✂️').setLabel('Scissors').setCustomId('scissors').setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(RBtn, PBtn, SBtn);
        // ----

        await interaction.reply({
            content: `${user}`,
            embeds: [
                new EmbedBuilder()
                    .setTitle('Rock..Paper..Scissors.. SHOOT!!')
                    .setColor(BotColor.Invisible)
                    .setDescription(`${interaction.user} has invited ${user} to play Rock..Paper..Scissors. Use the buttons below to select your choice.\n*Button session will end in 1m*`)
            ],
            components: [row]
        });

        const filter = (i: ButtonInteraction) => {
            const responded = results.get(i.user.id);
            if (responded) {
                i.reply({ embeds: [new EmbedBuilder().setTitle('Ohh Noo! Looks like you have already chosen.').setColor('Red')], ephemeral: true });
            }
            return (i.user.id === interaction.user.id || i.user.id === user.id) && !responded;
        }
        const collector = interaction.channel!.createMessageComponentCollector({ componentType: ComponentType.Button, time: ms('1m'), filter, maxUsers: 2 });

        collector.on('collect', (interaction) => {
            results.set(interaction.user.id, interaction.customId);
            interaction.reply({
                content: `Selected: ${interaction.component.emoji!.name} ${interaction.component.label}.`,
                ephemeral: true
            });
        });
        collector.on('end', async () => {
            row.components.forEach((value: any) => value.setDisabled(true));
            const nEmbed = new EmbedBuilder()
                .setTitle('Game Ended!')
                .setColor('Red')
                .setTimestamp();
            await interaction.editReply({ content: '', embeds: [nEmbed], components: [row] })

            const response = new EmbedBuilder().setColor('Green');

            if(results.size <= 1) { 
                interaction.followUp({ embeds: [response.setTitle('Uh Oh!').setDescription(`${user} didn't reply in time 😲`)], ephemeral: true });
                return;
            }
            const res1 = results.get(interaction.user.id);
            const res2 = results.get(user.id);

            if (res1 === res2) {
                await interaction.followUp({ embeds: [response.setTitle('Looks like it was a draw 🤷')] });
                return;
            }

            if (res1 === 'rock' && res2 === 'paper') {
                response.setTitle(`🎉 ${user.username} has Won! 🎉`);
            } else if (res1 === 'paper' && res2 === 'scissors') {
                response.setTitle(`🎉 ${user.username} has Won! 🎉`);
            } else if (res1 === 'scissors' && res2 === 'rock') {
                response.setTitle(`🎉 ${user.username} has Won! 🎉`);
            } else {
                response.setTitle(`🎉 ${interaction.user.username} has Won! 🎉`);
            }
            await interaction.followUp({
                embeds: [response]
            });
        });
        results.clear();
    }
}