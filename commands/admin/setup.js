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
                .addChoices({ name: 'ticket', value: 'ticket' }, { name: 'xp', value: 'xp' }, { name: 'vérification', value: 'verify' }, { name: 'logs', value: 'logs' }, { name: 'arrivées et départs', value: 'WelcomeLeave' }, { name: 'stats serveur', value: 'stats' })
        )
        .addIntegerOption((options) =>
            options
                .setName("valeur")
                .setDescription("Valeur de la configuration")
                .setRequired(true)
                .addChoices({ name: 'True', value: 1 }, { name: 'False', value: 0 })
        ),

    async run(_, message) {
        const ModuleType = message.options.getString("type");
        const ModuleValue = message.options.get("valeur");
        const checkTicket = await Admins.findOne({ where: { Module: "ticket" } });
        const checkXP = await Admins.findOne({ where: { Module: "xp" } });
        const checkVerify = await Admins.findOne({ where: { Module: "verify" } });
        const checkLogs = await Admins.findOne({ where: { Module: "logs" } });
        const checkLogsConfig = await Infos.findOne({ where: { Infos: "logs" } });
        const checkWelcomeLeave = await Admins.findOne({ where: { Module: "WelcomeLeave" } });
        const checkWelcomeLeaveConfig = await Infos.findOne({ where: { Infos: "WelcomeLeave" } });
        const checkStats = await Admins.findOne({ where: { Module: "stats" } });
        const checkStatsMembersConfig = await Infos.findOne({ where: { Infos: "statsmembers" } });
        const checkStatsBotsConfig = await Infos.findOne({ where: { Infos: "statsbots" } });
        try {
            if (ModuleType === "ticket") {
                if (ModuleValue.value === 1) {
                    if (checkTicket.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "ticket" } });
                } else {
                    if (checkTicket.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "ticket" } });
                }
            }
            if (ModuleType === "xp") {
                if (ModuleValue.value === 1) {
                    if (checkXP.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "xp" } });
                } else {
                    if (checkXP.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "xp" } });
                }
            }
            if (ModuleType === "verify"){
                if (ModuleValue.value === 1) {
                    if (checkVerify.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "verify" } });
                } else {
                    if (checkVerify.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "verify" } });
                }
            }
            if (ModuleType === "logs") {
                if (checkLogsConfig.Valeur === false) return message.reply({ content: "Le module de logs n'est pas configuré. Merci de le faire avec la commande /config avant de l'activer", ephemeral: true });
                if (ModuleValue.value === 1) {
                    if (checkLogs.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "logs" } });
                } else {
                    if (checkLogs.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "logs" } });
                }
            }
            if (ModuleType === "WelcomeLeave") {
                if (checkWelcomeLeaveConfig.Valeur === false) return message.reply({ content: "Le module d'arrivées et départs n'est pas configuré. Merci de le faire avec la commande /config avant de l'activer", ephemeral: true });
                if (ModuleValue.value === 1) {
                    if (checkWelcomeLeave.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "WelcomeLeave" } });
                } else {
                    if (checkWelcomeLeave.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "WelcomeLeave" } });
                }
            }
            if (ModuleType === "stats") {
                if (checkStatsMembersConfig.Valeur === false && checkStatsBotsConfig.Valeur === false) return message.reply({ content: "Le module de stats n'est pas configuré. Merci de le faire avec la commande /config avant de l'activer", ephemeral: true });
                if (ModuleValue.value === 1) {
                    if (checkStats.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "stats" } });
                } else {
                    if (checkStats.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "stats" } });
                }
            }
            await message.reply({ content: "La configuration a bien été enregistrée", ephemeral: true });
        } catch (err) {
            message.reply({ content: `Une erreur est survenue. Merci de contacter ${Ori} au plus vite`, ephemeral: true });
            console.log(err);
        }
    }
};
