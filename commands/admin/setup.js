const { PermissionFlagsBits, SlashCommandBuilder} = require('discord.js');
const Admins = require('../../modules/Admin')
const Infos = require('../../modules/Infos')
const Ori = `<@421416465430741003>`
module.exports = {

    command : new SlashCommandBuilder()
        .setName('setup')
        .setDescription("Permet d'activer ou de désactiver un module")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options
                .setName("type")
                .setDescription("Type de configuration")
                .setRequired(true)
                .addChoices({ name: 'ticket', value: 'ticket' }, { name: 'xp', value: 'xp' }, { name: 'vérification', value: 'verify' }, { name: 'MessageLogs', value: 'MessageLogs' }, {name: 'VocLogs', value: 'VocLogs' }, { name: 'arrivées et départs', value: 'WelcomeLeave' }, { name: 'stats serveur', value: 'stats' }, { name: 'Message de level up', value: 'levelup' }, { name: 'Message de nouveau rôle', value: 'NewRole' })
        )
        .addIntegerOption((options) =>
            options
                .setName("valeur")
                .setDescription("Valeur de la configuration")
                .setRequired(true)
                .addChoices({ name: 'True', value: 1 }, { name: 'False', value: 0 })
        ),

    async run(_, message) {
        const ServeurID = message.guild.id;
        const ModuleType = message.options.getString("type");
        const ModuleValue = message.options.get("valeur");

        await Admins.findOne({ where: { IDServeur: null } }).then(async (data) => {
            if (data) {
                await Admins.update({ IDServeur: ServeurID }, { where: { IDServeur: null } });
            }
        });

        const checkAdmin = await Admins.findOne({ where: { Module: ModuleType, IDServeur: ServeurID } });
        if (!checkAdmin) await Admins.create({ IDServeur: ServeurID, Module: ModuleType, Valeur: false });

        const checkConfig = await Infos.findOne({ where: { Infos: ModuleType, IDServeur: ServeurID } });
        if (!checkConfig) await Infos.create({ IDServeur: ServeurID, Infos: ModuleType, Valeur: false });

        try {
            switch (ModuleType) {
                case "ticket": {
                    const checkTicket = await Admins.findOne({ where: { Module: ModuleType, IDServeur: ServeurID } });
                    if (ModuleValue.value === 1) {
                        if (checkTicket.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                        await Admins.update({ Valeur: true }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    } else {
                        if (checkTicket.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                        await Admins.update({ Valeur: false }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    }
                    break;
                }
                case "xp": {
                    const checkXP = await Admins.findOne({ where: { Module: ModuleType, IDServeur: ServeurID } });
                    if (ModuleValue.value === 1) {
                        if (checkXP.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                        await Admins.update({ Valeur: true }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    } else {
                        if (checkXP.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                        await Admins.update({ Valeur: false }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    }
                    break;
                }
                case "verify": {
                    const checkVerify = await Admins.findOne({ where: { Module: ModuleType, IDServeur: ServeurID } });
                    if (ModuleValue.value === 1) {
                        if (checkVerify.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                        await Admins.update({ Valeur: true }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    } else {
                        if (checkVerify.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                        await Admins.update({ Valeur: false }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    }
                    break;
                }
                case "MessageLogs": {
                    const checkMessageLogsConfig = await Infos.findOne({ where: { Infos: ModuleType, IDServeur: ServeurID } });
                    const checkMessageLogs = await Admins.findOne({ where: { Module: ModuleType, IDServeur: ServeurID } });
                    if (checkMessageLogsConfig.Valeur === false) return message.reply({ content: "Le module de logs pour les messages n'est pas configuré. Merci de le faire avec la commande /config avant de l'activer", ephemeral: true });
                    if (ModuleValue.value === 1) {
                        if (checkMessageLogs.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                        await Admins.update({ Valeur: true }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    } else {
                        if (checkMessageLogs.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                        await Admins.update({ Valeur: false }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    }
                    break;
                }
                case "VocLogs": {
                    const checkVocLogsConfig = await Infos.findOne({ where: { Infos: ModuleType, IDServeur: ServeurID } });
                    const checkVocLogs = await Admins.findOne({ where: { Module: ModuleType, IDServeur: ServeurID } });
                    if (checkVocLogsConfig.Valeur === false) return message.reply({ content: "Le module de logs pour les vocaux n'est pas configuré. Merci de le faire avec la commande /config avant de l'activer", ephemeral: true });
                    if (ModuleValue.value === 1) {
                        if (checkVocLogs.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                        await Admins.update({ Valeur: true }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    } else {
                        if (checkVocLogs.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                        await Admins.update({ Valeur: false }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    }
                    break;
                }   
                case "WelcomeLeave": {
                    const checkWelcomeLeaveConfig = await Infos.findOne({ where: { Infos: ModuleType, IDServeur: ServeurID } });
                    const checkWelcomeLeave = await Admins.findOne({ where: { Module: ModuleType, IDServeur: ServeurID } });
                    if (checkWelcomeLeaveConfig.Valeur === false) return message.reply({ content: "Le module d'arrivées et départs n'est pas configuré. Merci de le faire avec la commande /config avant de l'activer", ephemeral: true });
                    if (ModuleValue.value === 1) {
                        if (checkWelcomeLeave.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                        await Admins.update({ Valeur: true }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    } else {
                        if (checkWelcomeLeave.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                        await Admins.update({ Valeur: false }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    }
                    break;
                }
                case "stats": {
                    const checkStatsMembersConfig = await Infos.findOne({ where: { Infos: "statsMembers", IDServeur: ServeurID } });
                    const checkStatsBotsConfig = await Infos.findOne({ where: { Infos: "statsBots", IDServeur: ServeurID } });
                    const checkStats = await Admins.findOne({ where: { Module: ModuleType, IDServeur: ServeurID } });
                    if (checkStatsMembersConfig.Valeur === false && checkStatsBotsConfig.Valeur === false) return message.reply({ content: "Le module de stats n'est pas configuré. Merci de le faire avec la commande /config avant de l'activer", ephemeral: true });
                    if (ModuleValue.value === 1) {
                        if (checkStats.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                        await Admins.update({ Valeur: true }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    } else {
                        if (checkStats.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                        await Admins.update({ Valeur: false }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    }
                    break;
                }
                case "levelup": {
                    const checkLevelUp = await Admins.findOne({ where: { Module: ModuleType, IDServeur: ServeurID } });
                    if (ModuleValue.value === 1) {
                    if (checkLevelUp.Valeur === true) return message.reply({ content: "Les messages de levelup sont déjà activés", ephemeral: true });
                        await Admins.update({ Valeur: true }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    } else {
                        if (checkLevelUp.Valeur === false) return message.reply({ content: "Les messages de levelup sont déjà désactivés", ephemeral: true });
                        await Admins.update({ Valeur: false }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    }
                    break;
                }
                case "NewRole": {
                    const checkNewRole = await Admins.findOne({ where: { Module: ModuleType, IDServeur: ServeurID } });
                    if (ModuleValue.value === 1) {
                    if (checkNewRole.Valeur === true) return message.reply({ content: "Les messages de nouveau rôle sont déjà activés", ephemeral: true });
                        await Admins.update({ Valeur: true }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    } else {
                        if (checkNewRole.Valeur === false) return message.reply({ content: "Les messages de nouveau rôle sont déjà désactivés", ephemeral: true });
                        await Admins.update({ Valeur: false }, { where: { Module: ModuleType, IDServeur: ServeurID } });
                    }
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
