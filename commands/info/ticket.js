const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { openticket } = require("../../config.json");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Créer un ticket')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async run(client, inter) {
        const { guild } = inter

        const embed = new EmbedBuilder()
            .setDescription("Ouvrir un ticket support")

        const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId("member").setLabel("Signaler un membre").setStyle(ButtonStyle.Danger).setEmoji('🚩'),
            new ButtonBuilder().setCustomId("bug").setLabel("Signaler un bug").setStyle(ButtonStyle.Secondary).setEmoji('🐞'),
            new ButtonBuilder().setCustomId("server").setLabel("Problème serveur").setStyle(ButtonStyle.Primary).setEmoji('🛎️'),
            new ButtonBuilder().setCustomId("other").setLabel("Besoin de support (autre)").setStyle(ButtonStyle.Success).setEmoji('🎫'),
        );

        await guild.channels.cache.get(openticket).send({
            embeds: ([embed]),
            components: [
                button
            ]
        });

        inter.reply({content: "Le ticket a bien été envoyé", ephemeral: true});
    }
}