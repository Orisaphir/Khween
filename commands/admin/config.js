const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const Infos = require('../../modules/Infos')
module.exports = {

    command : new SlashCommandBuilder()
        .setName('config')
        .setDescription('Permet de configurer les infos pour le bot')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options
                .setName('type')
                .setDescription('Type de configuration')
                .setRequired(true)
                .addChoices({ name: 'Channel pour demander un Ticket', value: 'openticketID' }, { name: 'Catégorie pour les Tickets', value: 'ticketchannelID' }, { name: 'Catégorie pour les Tickets archivés', value: 'archiveticketID' }, { name: 'Channel pour les logs', value: 'logsID' }, { name: 'Channel pour les arrivées et départs', value: 'WelcomeLeaveID' }, { name: 'Channel Vocal pour les Stats Serveur des Membres', value: 'statsmemberID' }, { name: 'Channel Vocal pour les Stats Serveur des Bots', value: 'statsbotsID' }, { name: 'Channel pour le level up', value: 'levelupID' })
        )
        .addStringOption((options) => options.setName("id").setDescription('ID du channel ou de la catégorie').setRequired(true)),

    async run(_, message) {
        const Type = message.options.getString('type');
        const ID = message.options.getString('id');
        const checkID = await message.guild.channels.cache.get(ID);
        
        const ServeurID = message.guild.id;

        await Infos.findOne({ where: { IDServeur: null } }).then(async (data) => {
            if (data) {
                await Infos.update({ IDServeur: ServeurID }, { where: { IDServeur: null } });
            }
        });

        

        const checkOpenticket = await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "openticket" } });
        if (!checkOpenticket) await Infos.create({ IDServeur: ServeurID, Infos: "openticket", Valeur: false });

        const checkTicketchannel = await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "ticketchannel" } });
        if (!checkTicketchannel) await Infos.create({ IDServeur: ServeurID, Infos: "ticketchannel", Valeur: false });

        const checkArchiveticket = await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "archiveticket" } });
        if (!checkArchiveticket) await Infos.create({ IDServeur: ServeurID, Infos: "archiveticket", Valeur: false });

        const checkLogs = await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "logs" } });
        if (!checkLogs) await Infos.create({ IDServeur: ServeurID, Infos: "logs", Valeur: false });

        const checkWelcomeLeave = await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "WelcomeLeave" } });
        if (!checkWelcomeLeave) await Infos.create({ IDServeur: ServeurID, Infos: "WelcomeLeave", Valeur: false });

        const checkStatsmembers = await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "statsmembers" } });
        if (!checkStatsmembers) await Infos.create({ IDServeur: ServeurID, Infos: "statsmembers", Valeur: false });

        const checkStatsbots = await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "statsbots" } });
        if (!checkStatsbots) await Infos.create({ IDServeur: ServeurID, Infos: "statsbots", Valeur: false });

        const checkLevelup = await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "levelup" } });
        if (!checkLevelup) await Infos.create({ IDServeur: ServeurID, Infos: "levelup", Valeur: false });

        if (isNaN(ID)) return message.reply({ content: "Tu ne m'as pas donné un ID ! C'est une suite de 17 à 19 chiffres qu'il me faut !", ephemeral: true });
        if (!checkID) return message.reply({ content: "L'ID indiqué n'est pas valide !", ephemeral: true });
        try {
            if (Type === "openticketID") {
                await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "openticket" } }).then(async (data) => {
                    if (!data) {
                        await Infos.create({ IDServeur: ServeurID, Infos: "openticket", Valeur: false });
                    }
                });
                if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "openticket", IDServeur: ServeurID } });
            }
            if (Type === "ticketchannelID") {
                await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "ticketchannel" } }).then(async (data) => {
                    if (!data) {
                        await Infos.create({ IDServeur: ServeurID, Infos: "ticketchannel", Valeur: false });
                    }
                });
                if (checkID.type !== 4) return message.reply({ content: "L'ID indiqué n'est pas une catégorie !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "ticketchannel", IDServeur: ServeurID } });
            }
            if (Type === "archiveticketID") {
                await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "archiveticket" } }).then(async (data) => {
                    if (!data) {
                        await Infos.create({ IDServeur: ServeurID, Infos: "archiveticket", Valeur: false });
                    }
                });
                if (checkID.type !== 4) return message.reply({ content: "L'ID indiqué n'est pas une catégorie !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "archiveticket", IDServeur: ServeurID } });
            }
            if (Type === "logsID") {
                await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "logs" } }).then(async (data) => {
                    if (!data) {
                        await Infos.create({ IDServeur: ServeurID, Infos: "logs", Valeur: false });
                    }
                });
                if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "logs", IDServeur: ServeurID } });
            }
            if (Type === "WelcomeLeaveID") {
                await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "WelcomeLeave" } }).then(async (data) => {
                    if (!data) {
                        await Infos.create({ IDServeur: ServeurID, Infos: "WelcomeLeave", Valeur: false });
                    }
                });
                if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "WelcomeLeave", IDServeur: ServeurID } });
            }
            if (Type === "statsmemberID") {
                await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "statsmembers" } }).then(async (data) => {
                    if (!data) {
                        await Infos.create({ IDServeur: ServeurID, Infos: "statsmembers", Valeur: false });
                    }
                });
                if (checkID.type !== 2) return message.reply({ content: "L'ID indiqué n'est pas un salon vocal !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "statsmembers", IDServeur: ServeurID } });
            }
            if (Type === "statsbotsID") {
                await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "statsbots" } }).then(async (data) => {
                    if (!data) {
                        await Infos.create({ IDServeur: ServeurID, Infos: "statsbots", Valeur: false });
                    }
                });
                if (checkID.type !== 2) return message.reply({ content: "L'ID indiqué n'est pas un salon vocal !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "statsbots", IDServeur: ServeurID } });
            }
            if (Type === "levelupID") {
                await Infos.findOne({ where: { IDServeur: ServeurID, Infos: "levelup" } }).then(async (data) => {
                    if (!data) {
                        await Infos.create({ IDServeur: ServeurID, Infos: "levelup", Valeur: false });
                    }
                });
                if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "levelup", IDServeur: ServeurID } });
            }
            await message.reply({ content: "La configuration a bien été enregistrée", ephemeral: true });
        } catch (err) {
            message.reply({ content: `Une erreur est survenue. Merci de contacter ${Ori} au plus vite`, ephemeral: true });
            console.log(err);
        }
    }
};