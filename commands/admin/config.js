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
                .addChoices({ name: 'Channel pour demander un Ticket', value: 'openticket' }, { name: 'Catégorie pour les Tickets', value: 'ticketchannel' }, { name: 'Catégorie pour les Tickets archivés', value: 'archiveticket' }, { name: 'Channel pour les logs des Messages', value: 'MessageLogs' }, {name: 'Channel pour les logs Vocaux', value: 'VocLogs' }, { name: 'Channel pour les arrivées et départs', value: 'WelcomeLeave' }, { name: 'Channel Vocal pour les Stats Serveur des Membres', value: 'statsmember' }, { name: 'Channel Vocal pour les Stats Serveur des Bots', value: 'statsbots' }, { name: 'Channel pour le level up', value: 'levelup' })
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

        const CheckInfos = await Infos.findOne({ where: { IDServeur: ServeurID, Infos: Type } });
        if (!CheckInfos) await Infos.create({ IDServeur: ServeurID, Infos: Type, Valeur: false });

        if (isNaN(ID)) return message.reply({ content: "Tu ne m'as pas donné un ID ! C'est une suite de 17 à 19 chiffres qu'il me faut !", ephemeral: true });
        if (!checkID) return message.reply({ content: "L'ID indiqué n'est pas valide !", ephemeral: true });
        try {
            switch (Type) {
                case "openticket": {
                    if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                    await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: Type, IDServeur: ServeurID } });
                    break;
                }
                case "ticketchannel": {
                    if (checkID.type !== 4) return message.reply({ content: "L'ID indiqué n'est pas une catégorie !", ephemeral: true });
                    await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: Type, IDServeur: ServeurID } });
                    break;
                }
                case "archiveticket": {
                    if (checkID.type !== 4) return message.reply({ content: "L'ID indiqué n'est pas une catégorie !", ephemeral: true });
                    await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: Type, IDServeur: ServeurID } });
                    break;
                }
                case "MessageLogs": {
                    if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                    await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: Type, IDServeur: ServeurID } });
                    break;
                }
                case "VocLogs": {
                    if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                    await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: Type, IDServeur: ServeurID } });
                    break;
                }
                case "WelcomeLeave": {
                    if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                    await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: Type, IDServeur: ServeurID } });
                    break;
                }
                case "statsmember": {
                    if (checkID.type !== 2) return message.reply({ content: "L'ID indiqué n'est pas un salon vocal !", ephemeral: true });
                    await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: Type, IDServeur: ServeurID } });
                    break;
                }
                case "statsbots": {
                    if (checkID.type !== 2) return message.reply({ content: "L'ID indiqué n'est pas un salon vocal !", ephemeral: true });
                    await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: Type, IDServeur: ServeurID } });
                    break;
                }
                case "levelup": {
                    if (checkID.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
                    await Infos.update({ DiscordID: ID, Valeur: true }, { where: { Infos: Type, IDServeur: ServeurID } });
                    break;
                }
            }
            await message.reply({ content: "La configuration a bien été enregistrée", ephemeral: true });
        } catch (err) {
            message.reply({ content: `Une erreur est survenue. Merci de contacter ${Ori} au plus vite`, ephemeral: true });
            console.log(err);
        }
    }
};