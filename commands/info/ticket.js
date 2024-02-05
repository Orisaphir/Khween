const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const Admins = require('../../modules/Admin')
const Infos = require('../../modules/Infos');

module.exports = {

    command: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Créer le support ticket')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addIntegerOption((options) => 
            options
                .setName("force")
                .setDescription("Forcer l'envoi du message de support Ticket")
                .setRequired(true)
                .addChoices({ name: 'True', value: 1 }, { name: 'False', value: 0 })
        ),

    async run(client, inter) {

        const GetForce = inter.options.getInteger("force");
        let force = false;
        if (GetForce === 1)
            force = true;

        const openticketInfos = await Infos.findOne({ where: { Infos: "openticket" } });
        const adminInfos = await Admins.findOne({ where: { Module: "ticket" } });
        if (openticketInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer le Channel où sera envoyé le Ticket avec la commande /config", ephemeral: true });
        if (adminInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez l'activer avec la commande /setup", ephemeral: true });

        const openticket = openticketInfos.DiscordID;
        try {
            const CheckChannel = await inter.guild.channels.cache.get(openticket);
            if (!CheckChannel) {
                await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "openticket" } });
                return inter.reply({ content: "Le salon du support Ticket n'existe plus ou est introuvable. Merci de le reconfigurer avec la commande /config !", ephemeral: true });
            
            }
        } catch (err) {
            console.log(err);
            return inter.reply({ content: "Une erreur est survenue à la création du support Ticket. Merci de contacter @Orisaphir au plus vite.", ephemeral: true });
        }
        if (force === false) {
            const CheckMessage = await inter.guild.channels.cache.get(openticket).messages.fetch({ limit: 1 });
            if (CheckMessage.size !== 0) return inter.reply({ content: "Le message du support Ticket est déjà envoyé (le salon ne doit comporter aucun message)", ephemeral: true });
        }
        

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