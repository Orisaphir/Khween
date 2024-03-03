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
                .addChoices({ name: 'ticket', value: 'ticket' }, { name: 'xp', value: 'xp' }, { name: 'vérification', value: 'verify' }, { name: 'logs', value: 'logs' }, { name: 'arrivées et départs', value: 'WelcomeLeave' }, { name: 'stats serveur', value: 'stats' }, { name: 'Message de level up', value: 'levelup' }, { name: 'Message de nouveau rôle', value: 'newrole' })
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

        const checkTicket = await Admins.findOne({ where: { Module: "ticket", IDServeur: ServeurID } });
        if (!checkTicket) await Admins.create({ IDServeur: ServeurID, Module: "ticket", Valeur: false });

        const checkXP = await Admins.findOne({ where: { Module: "xp", IDServeur: ServeurID } });
        if (!checkXP) await Admins.create({ IDServeur: ServeurID, Module: "xp", Valeur: false });

        const checkVerify = await Admins.findOne({ where: { Module: "verify", IDServeur: ServeurID } });
        if (!checkVerify) await Admins.create({ IDServeur: ServeurID, Module: "verify", Valeur: false });

        const checkLogs = await Admins.findOne({ where: { Module: "logs", IDServeur: ServeurID } });
        if (!checkLogs) await Admins.create({ IDServeur: ServeurID, Module: "logs", Valeur: false });

        const checkLogsConfig = await Infos.findOne({ where: { Infos: "logs", IDServeur: ServeurID } });
        if (!checkLogsConfig) await Infos.create({ IDServeur: ServeurID, Infos: "logs", Valeur: false });

        const checkWelcomeLeave = await Admins.findOne({ where: { Module: "WelcomeLeave", IDServeur: ServeurID } });
        if (!checkWelcomeLeave) await Admins.create({ IDServeur: ServeurID, Module: "WelcomeLeave", Valeur: false });

        const checkWelcomeLeaveConfig = await Infos.findOne({ where: { Infos: "WelcomeLeave", IDServeur: ServeurID } });
        if (!checkWelcomeLeaveConfig) await Infos.create({ IDServeur: ServeurID, Infos: "WelcomeLeave", Valeur: false });

        const checkStats = await Admins.findOne({ where: { Module: "stats", IDServeur: ServeurID } });
        if (!checkStats) await Admins.create({ IDServeur: ServeurID, Module: "stats", Valeur: false });

        const checkStatsMembersConfig = await Infos.findOne({ where: { Infos: "statsmembers", IDServeur: ServeurID } });
        if (!checkStatsMembersConfig) await Infos.create({ IDServeur: ServeurID, Infos: "statsmembers", Valeur: false });

        const checkStatsBotsConfig = await Infos.findOne({ where: { Infos: "statsbots", IDServeur: ServeurID } });
        if (!checkStatsBotsConfig) await Infos.create({ IDServeur: ServeurID, Infos: "statsbots", Valeur: false });

        const checkLevelUp = await Admins.findOne({ where: { Module: "levelup", IDServeur: ServeurID } });
        if (!checkLevelUp) await Admins.create({ IDServeur: ServeurID, Module: "levelup", Valeur: false });

        const checkNewRole = await Admins.findOne({ where: { Module: "NewRole", IDServeur: ServeurID } });
        if (!checkNewRole) await Admins.create({ IDServeur: ServeurID, Module: "NewRole", Valeur: false });

        try {
            if (ModuleType === "ticket") {
                await Admins.findOne({ where: { Module: "ticket", IDServeur: ServeurID } }).then(async (data) => {
                    if (!data) {
                        await Admins.create({ IDServeur: ServeurID, Module: "ticket", Valeur: false });
                    }
                });
                if (ModuleValue.value === 1) {
                    if (checkTicket.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "ticket", IDServeur: ServeurID } });
                } else {
                    if (checkTicket.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "ticket", IDServeur: ServeurID } });
                }
            }
            if (ModuleType === "xp") {
                await Admins.findOne({ where: { Module: "xp", IDServeur: ServeurID } }).then(async (data) => {
                    if (!data) {
                        await Admins.create({ IDServeur: ServeurID, Module: "xp", Valeur: false });
                    }
                });
                if (ModuleValue.value === 1) {
                    if (checkXP.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "xp", IDServeur: ServeurID } });
                } else {
                    if (checkXP.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "xp", IDServeur: ServeurID } });
                }
            }
            if (ModuleType === "verify"){
                await Admins.findOne({ where: { Module: "verify", IDServeur: ServeurID } }).then(async (data) => {
                    if (!data) {
                        await Admins.create({ IDServeur: ServeurID, Module: "verify", Valeur: false });
                    }
                });
                if (ModuleValue.value === 1) {
                    if (checkVerify.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "verify", IDServeur: ServeurID } });
                } else {
                    if (checkVerify.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "verify", IDServeur: ServeurID } });
                }
            }
            if (ModuleType === "logs") {
                await Admins.findOne({ where: { Module: "logs", IDServeur: ServeurID } }).then(async (data) => {
                    if (!data) {
                        await Admins.create({ IDServeur: ServeurID, Module: "logs", Valeur: false });
                    }
                });
                if (checkLogsConfig.Valeur === false) return message.reply({ content: "Le module de logs n'est pas configuré. Merci de le faire avec la commande /config avant de l'activer", ephemeral: true });
                if (ModuleValue.value === 1) {
                    if (checkLogs.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "logs", IDServeur: ServeurID } });
                } else {
                    if (checkLogs.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "logs", IDServeur: ServeurID } });
                }
            }
            if (ModuleType === "WelcomeLeave") {
                await Admins.findOne({ where: { Module: "WelcomeLeave", IDServeur: ServeurID } }).then(async (data) => {
                    if (!data) {
                        await Admins.create({ IDServeur: ServeurID, Module: "WelcomeLeave", Valeur: false });
                    }
                });
                if (checkWelcomeLeaveConfig.Valeur === false) return message.reply({ content: "Le module d'arrivées et départs n'est pas configuré. Merci de le faire avec la commande /config avant de l'activer", ephemeral: true });
                if (ModuleValue.value === 1) {
                    if (checkWelcomeLeave.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "WelcomeLeave", IDServeur: ServeurID } });
                } else {
                    if (checkWelcomeLeave.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "WelcomeLeave", IDServeur: ServeurID } });
                }
            }
            if (ModuleType === "stats") {
                await Admins.findOne({ where: { Module: "stats", IDServeur: ServeurID } }).then(async (data) => {
                    if (!data) {
                        await Admins.create({ IDServeur: ServeurID, Module: "stats", Valeur: false });
                    }
                });
                if (checkStatsMembersConfig.Valeur === false && checkStatsBotsConfig.Valeur === false) return message.reply({ content: "Le module de stats n'est pas configuré. Merci de le faire avec la commande /config avant de l'activer", ephemeral: true });
                if (ModuleValue.value === 1) {
                    if (checkStats.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "stats", IDServeur: ServeurID } });
                } else {
                    if (checkStats.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "stats", IDServeur: ServeurID } });
                }
            }
            if (ModuleType === "levelup") {
                await Admins.findOne({ where: { Module: "levelup", IDServeur: ServeurID } }).then(async (data) => {
                    if (!data) {
                        await Admins.create({ IDServeur: ServeurID, Module: "levelup", Valeur: false });
                    }
                });
                if (ModuleValue.value === 1) {
                   if (checkLevelUp.Valeur === true) return message.reply({ content: "Les messages de levelup sont déjà activés", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "levelup", IDServeur: ServeurID } });
                } else {
                    if (checkLevelUp.Valeur === false) return message.reply({ content: "Les messages de levelup sont déjà désactivés", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "levelup", IDServeur: ServeurID } });
                }
            }
            if (ModuleType === "newrole") {
                await Admins.findOne({ where: { Module: "NewRole", IDServeur: ServeurID } }).then(async (data) => {
                    if (!data) {
                        await Admins.create({ IDServeur: ServeurID, Module: "NewRole", Valeur: false });
                    }
                });
                if (ModuleValue.value === 1) {
                   if (checkNewRole.Valeur === true) return message.reply({ content: "Les messages de nouveau rôle sont déjà activés", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "NewRole", IDServeur: ServeurID } });
                } else {
                    if (checkNewRole.Valeur === false) return message.reply({ content: "Les messages de nouveau rôle sont déjà désactivés", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "NewRole", IDServeur: ServeurID } });
                }
            }
            await message.reply({ content: "La configuration a bien été enregistrée", ephemeral: true });
        } catch (err) {
            message.reply({ content: `Une erreur est survenue. Merci de contacter ${Ori} au plus vite`, ephemeral: true });
            console.log(err);
        }
    }
};
