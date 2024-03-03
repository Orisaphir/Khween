const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const Admins = require('../../modules/Admin')
const Infos = require('../../modules/Infos');
const Msg = require('../../modules/Msg');
const HistoData = require('../../modules/HistoData');

module.exports = {
    
    command : new SlashCommandBuilder()
        .setName('verifycreate')
        .setDescription("Créer le message de vérification")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((options) => 
            options
                .setName("force")
                .setDescription("Forcer l'envoi du message de vérification")
                .setRequired(false)
                .addChoices({ name: 'True', value: 1 }, { name: 'False', value: 0 })
        ),

    async run(client, inter) {

        const ServeurID = inter.guild.id;

        await Infos.findOne({ where: { IDServeur: null } }).then(async (data) => {
            if (data) {
                await Infos.update({ IDServeur: ServeurID }, { where: { IDServeur: null } });
            }
        });
        await Admins.findOne({ where: { IDServeur: null } }).then(async (data) => {
            if (data) {
                await Admins.update({ IDServeur: ServeurID }, { where: { IDServeur: null } });
            }
        });
        await HistoData.findOne({ where: { IDServeur: null } }).then(async (data) => {
            if (data) {
                await HistoData.update({ IDServeur: ServeurID }, { where: { IDServeur: null } });
            }
        });
        await Msg.findOne({ where: { IDServeur: null } }).then(async (data) => {
            if (data) {
                await Msg.update({ IDServeur: ServeurID }, { where: { IDServeur: null } });
            }
        });

        const GetForce = inter.options.getInteger("force");
        let force = false;
        if (GetForce === 1)
            force = true;
        const verifychannelInfos = await Infos.findOne({ where: { Infos: "verifychannel", IDServeur: ServeurID } });
        if (!verifychannelInfos) return inter.reply({ content: "Le salon de vérification n'est pas configuré, veuillez le configurer avec la commande /verifyconfig", ephemeral: true });
        const verifyroleInfos = await Infos.findOne({ where: { Infos: "verifyrole", IDServeur: ServeurID } });
        if (!verifyroleInfos) return inter.reply({ content: "Le rôle de vérification n'est pas configuré, veuillez le configurer avec la commande /verifyconfig", ephemeral: true });
        const adminInfos = await Admins.findOne({ where: { Module: "verify", IDServeur: ServeurID } });
        if (!adminInfos) await Admins.create({ IDServeur: ServeurID, Module: "verify", Valeur: false });
        const HistoVerify = await HistoData.findOne({ where: { Infos: "Verify", IDServeur: ServeurID } });
        if (!HistoVerify) await HistoData.create({ IDServeur: ServeurID, Infos: "Verify", Channel: null, Message: null });
        if (verifychannelInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer le Channel où sera envoyé le message de vérification avec la commande /verifyconfig", ephemeral: true });
        if (verifyroleInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer le Rôle qui sera donné avec la commande /verifyconfig", ephemeral: true });
        if (adminInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez l'activer avec la commande /setup", ephemeral: true });
        if (HistoVerify.Message !== null) return inter.reply({ content: "Le message de vérification est déjà envoyé", ephemeral: true });

        const verifychannel = verifychannelInfos.DiscordID;
        const verifyrole = verifyroleInfos.DiscordID;
        try {
            const CheckChannel = await inter.guild.channels.cache.get(verifychannel);
            if (!CheckChannel) {
                await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "verifychannel", IDServeur: ServeurID } });
                return inter.reply({ content: "Le salon de vérification n'existe plus ou est introuvable. Merci de le reconfigurer avec la commande /verifyconfig !", ephemeral: true });
            }
        } catch (err) {
            console.log(err);
            return inter.reply({ content: "Une erreur est survenue à la création du message de vérification. Merci de contacter @Orisaphir au plus vite.", ephemeral: true });
        }
        try {
            const CheckRole = await inter.guild.roles.cache.get(verifyrole);
            if (!CheckRole) {
                await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "verifyrole", IDServeur: ServeurID } });
                return inter.reply({ content: "Le rôle de vérification n'existe plus ou est introuvable. Merci de le reconfigurer avec la commande /verifyconfig !", ephemeral: true });
            }
        } catch (err) {
            console.log(err);
            return inter.reply({ content: "Une erreur est survenue à la création du message de vérification. Merci de contacter @Orisaphir au plus vite.", ephemeral: true });
        }
        if (force === false) {
            const CheckMessage = await inter.guild.channels.cache.get(verifychannel).messages.fetch({ limit: 1 });
            if (CheckMessage.size !== 0) return inter.reply({ content: "Le message de vérification est déjà envoyé (le salon ne doit comporter aucun message)", ephemeral: true });
        }

        const { guild } = inter

        let msgDesc = "Clique sur « vérifier » pour avoir accès au serveur !";

        const data = await Msg.findOne({ where: { Infos: "Verify", IDServeur: ServeurID } });
        const Part1 = data.Part1;
        let Part2 = data.Part2;
        if (Part2 === null) Part2 = "";

        if (Part1 !== null)
            msgDesc = `${Part1} ${Part2}`;

        const embed = new EmbedBuilder()
            .setTitle("Vérification")
            .setDescription(msgDesc)
            .setColor("#00FF00")
        
        const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId("verify").setLabel("Vérifier").setStyle(ButtonStyle.Success).setEmoji('✅'),
        );

        await guild.channels.cache.get(verifychannel).send({
            embeds: ([embed]),
            components: [
                button
            ]
        });
        const messagesend = await guild.channels.cache.get(verifychannel).messages.fetch({ limit: 1 });
        const messagesendID = messagesend.first().id;
        await HistoVerify.update({ Channel: verifychannel, Message: messagesendID }, { where: { Infos: "Verify", IDServeur: ServeurID } });


        inter.reply({content: "Le message de vérification a bien été envoyé", ephemeral: true});
    }
}