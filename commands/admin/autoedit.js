const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Msg = require('../../modules/Msg');
const Infos = require('../../modules/Infos');
const Admins = require('../../modules/Admin');
const HistoData = require('../../modules/HistoData');
const Ori = `<@421416465430741003>`;

module.exports = {
    
    command: new SlashCommandBuilder()
        .setName('autoedit')
        .setDescription("Permet d'éditer les messages selon la configuration de /msgconfig")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options
                .setName("type")
                .setDescription("Type de message")
                .setRequired(true)
                .addChoices({ name: `Message de vérification`, value: 'verify' }, { name: `Message du support Ticket`, value: 'ticket' })
        )
        .addStringOption((options) => options.setName("id").setDescription('ID ou lien du message').setRequired(true))
        .addStringOption((options) => options.setName("channel").setDescription(`ID du channel. À remplir seulement si un ID message est fourni au lieu d'un lien`).setRequired(false)),

    async run(_, message) {
        const Type = message.options.getString("type");
        const IDBrut = message.options.getString("id");
        const ServeurID = message.guild.id;

        await HistoData.findOne({ where: { IDServeur: null } }).then(async (data) => {
            if (data) {
                await HistoData.update({ IDServeur: ServeurID }, { where: { IDServeur: null } });
            }
        });
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

        let ID = IDBrut;
        let IDChannel = null;
        if (message.options.getString("channel")) {
            IDChannel = message.options.getString("channel");
        }
        if (IDBrut.includes('/')) {
            ID = IDBrut.split('/');
            ID = ID[ID.length - 1];
            IDChannel = IDBrut.split('/');
            IDChannel = IDChannel[IDChannel.length - 2];
        }
        if (isNaN(ID)) return message.reply({ content: "Tu ne m'as pas donné un ID valide ou le lien du message n'est pas correct !", ephemeral: true });
        if (IDChannel === null) return message.reply({ content: "Tu n'as pas fourni l'ID du salon du message !", ephemeral: true });
        if (IDChannel !== null && isNaN(IDChannel)) return message.reply({ content: "Tu ne m'as pas donné un ID valide pour le salon !", ephemeral: true });
        const checkChannel = await message.guild.channels.cache.get(IDChannel);
        if (!checkChannel) return message.reply({ content: "Je ne trouve pas le salon du message ! Vérifie l'ID ou le lien.", ephemeral: true });
        const messageCheck = await checkChannel.messages.fetch(ID);
        if (!messageCheck) return message.reply({ content: "Je ne trouve pas le message ! Vérifie l'ID ou le lien.", ephemeral: true });
        if (messageCheck.author.id !== message.client.user.id) return message.reply({ content: "Ce message n'est pas le mien !", ephemeral: true });

        try {
            if (Type === "verify") {
                const HistoVerify = await HistoData.findOne({ where: { Infos: "Verify", IDServeur: ServeurID } });
                const verifychannelInfos = await Infos.findOne({ where: { Infos: "verifychannel", IDServeur: ServeurID } });
                const verifyroleInfos = await Infos.findOne({ where: { Infos: "verifyrole", IDServeur: ServeurID } });
                const adminInfos = await Admins.findOne({ where: { Module: "verify", IDServeur: ServeurID } });
                if (verifyroleInfos.Valeur === false) return message.reply({ content: "Le module est désactivé, veuillez configurer le Rôle qui sera donné avec la commande /verifyconfig", ephemeral: true });
                if (adminInfos.Valeur === false) return message.reply({ content: "Le module est désactivé, veuillez l'activer avec la commande /setup", ephemeral: true });

                const verifyrole = verifyroleInfos.DiscordID;
                const verifychannel = verifychannelInfos.DiscordID;
                const HistoChannel = HistoVerify.Channel;
                const HistoMessage = HistoVerify.Message;
                const CheckRole = await message.guild.roles.cache.get(verifyrole);

                if (!CheckRole) {
                    await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "verifyrole", IDServeur: ServeurID } });
                    return message.reply({ content: "Le rôle de vérification n'existe plus ou est introuvable. Merci de le reconfigurer avec la commande /verifyconfig !", ephemeral: true });
                }

                if (HistoMessage !== null && HistoMessage !== messageCheck.id) return message.reply({ content: "Ce n'est pas mon message de vérification !", ephemeral: true });

                if (HistoChannel === null || HistoMessage === null) {
                    await HistoData.update({ Channel: verifychannel, Message: messageCheck.id }, { where: { Infos: "Verify", IDServeur: ServeurID } });
                }

                const data = await Msg.findOne({ where: { Infos: "Verify", IDServeur: ServeurID } });
                let Part1 = data.get("Part1");
                if (Part1 === null) return message.reply({ content: "Je n'ai aucun edit possible.", ephemeral: true });
                let Part2 = data.get("Part2");
                if (Part2 === null) Part2 = "";

                const embed = new EmbedBuilder()
                    .setTitle("Vérification")
                    .setDescription(`${Part1} ${Part2}`)
                    .setColor("#00FF00")
        
                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId("verify").setLabel("Vérifier").setStyle(ButtonStyle.Success).setEmoji('✅'),
                );
                await messageCheck.edit({ embeds: [embed], components: [button] });
            }
            if (Type === "ticket") {
                const openticketInfos = await Infos.findOne({ where: { Infos: "openticket", IDServeur: ServeurID } });
                const adminInfos = await Admins.findOne({ where: { Module: "ticket", IDServeur: ServeurID } });
                const HistoTicket = await HistoData.findOne({ where: { Infos: "Ticket", IDServeur: ServeurID } });
                if (openticketInfos.Valeur === false) return message.reply({ content: "Le module est désactivé, veuillez configurer le Channel où sera envoyé le Ticket avec la commande /config", ephemeral: true });
                if (adminInfos.Valeur === false) return message.reply({ content: "Le module est désactivé, veuillez l'activer avec la commande /setup", ephemeral: true });

                const openticket = openticketInfos.DiscordID;
                const HistoChannel = HistoTicket.Channel;
                const HistoMessage = HistoTicket.Message;
                if (HistoMessage !== null && HistoMessage !== messageCheck.id) return message.reply({ content: "Ce n'est pas mon message de ticket !", ephemeral: true });

                if (HistoChannel === null || HistoMessage === null) {
                    await HistoData.update({ Channel: openticket, Message: messageCheck.id }, { where: { Infos: "Ticket", IDServeur: ServeurID } });
                }

                const data = await Msg.findOne({ where: { Infos: "Ticket", IDServeur: ServeurID } });
                let Part1 = data.get("Part1");
                if (Part1 === null) return message.reply({ content: "Je n'ai aucun edit possible.", ephemeral: true });
                let Part2 = data.get("Part2");
                if (Part2 === null) Part2 = "";

                const embed = new EmbedBuilder()
                    .setDescription(`${Part1} ${Part2}`);
                
                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId("member").setLabel("Signaler un membre").setStyle(ButtonStyle.Danger).setEmoji('🚩'),
                    new ButtonBuilder().setCustomId("bug").setLabel("Signaler un bug").setStyle(ButtonStyle.Secondary).setEmoji('🐞'),
                    new ButtonBuilder().setCustomId("server").setLabel("Problème serveur").setStyle(ButtonStyle.Primary).setEmoji('🛎️'),
                    new ButtonBuilder().setCustomId("other").setLabel("Besoin de support (autre)").setStyle(ButtonStyle.Success).setEmoji('🎫'),
                );

                await messageCheck.edit({ embeds: [embed], components: [button] });
            }
            await message.reply({ content: "Le message a bien été édité !", ephemeral: true });
        } catch (err) {
            message.reply({ content: `Une erreur est survenue. Merci de contacter ${Ori} au plus vite`, ephemeral: true });
            console.log(err);
        }
    }
};