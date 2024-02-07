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
                .addChoices({ name: 'Channel pour demander un Ticket', value: 'openticketID' }, { name: 'Catégorie pour les Tickets', value: 'ticketchannelID' }, { name: 'Catégorie pour les Tickets archivés', value: 'archiveticketID' }, { name: 'Channel pour les logs', value: 'logsID' }, { name: 'Channel pour les arrivées et départs', value: 'WelcomeLeaveID' }, { name: 'Channel Vocal pour les Stats Serveur des Membres', value: 'statsmemberID' }, { name: 'Channel Vocal pour les Stats Serveur des Bots', value: 'statsbotsID' })
        )
        .addStringOption((options) => options.setName("id").setDescription('ID du channel ou de la catégorie').setRequired(true)),

    async run(_, message) {
        const Type = message.options.getString('type');
        const ID = message.options.getString('id');
        const checkID = await message.guild.channels.cache.get(ID);

        if (isNaN(ID)) return message.reply({ content: "Tu ne m'as pas donné un ID ! C'est une suite de 17 à 19 chiffres qu'il me faut !", ephemeral: true });
        if (!checkID) return message.reply({ content: "L'ID indiqué n'est pas valide !", ephemeral: true });
        try {
            if (Type === "openticketID") {
                if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "openticket" } });
            }
            if (Type === "ticketchannelID") {
                if (checkID.type !== 4) return message.reply({ content: "L'ID indiqué n'est pas une catégorie !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "ticketchannel" } });
            }
            if (Type === "archiveticketID") {
                if (checkID.type !== 4) return message.reply({ content: "L'ID indiqué n'est pas une catégorie !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "archiveticket" } });
            }
            if (Type === "logsID") {
                if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "logs" } });
            }
            if (Type === "WelcomeLeaveID") {
                if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "WelcomeLeave" } });
            }
            if (Type === "statsmemberID") {
                if (checkID.type !== 2) return message.reply({ content: "L'ID indiqué n'est pas un salon vocal !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "statsmembers" } });
            }
            if (Type === "statsbotsID") {
                if (checkID.type !== 2) return message.reply({ content: "L'ID indiqué n'est pas un salon vocal !", ephemeral: true });
                await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: "statsbots" } });
            }
            await message.reply({ content: "La configuration a bien été enregistrée", ephemeral: true });
        } catch (err) {
            message.reply({ content: `Une erreur est survenue. Merci de contacter ${Ori} au plus vite`, ephemeral: true });
            console.log(err);
        }
    }
};