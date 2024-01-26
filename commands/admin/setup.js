const { PermissionFlagsBits, SlashCommandBuilder} = require('discord.js');
const Admins = require('../../modules/Admin')
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
                .addChoices({ name: 'ticket', value: 'ticket' }, { name: 'xp', value: 'xp' }, { name: 'vérification', value: 'verify' })
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
        try {
            if (ModuleType === "ticket") {
                if (ModuleValue.value === 1) {
                    if (checkTicket.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                    await Admins.update({ Valeur: true }, { where: { Module: "ticket" } });
                } else {
                    if (checkTicket.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                    await Admins.update({ Valeur: false }, { where: { Module: "ticket" } });
                }
            } else {
                if (ModuleType === "xp") {
                    if (ModuleValue.value === 1) {
                        if (checkXP.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                        await Admins.update({ Valeur: true }, { where: { Module: "xp" } });
                    } else {
                        if (checkXP.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                        await Admins.update({ Valeur: false }, { where: { Module: "xp" } });
                    }
                } else {
                    if (ModuleValue.value === 1) {
                        if (checkVerify.Valeur === true) return message.reply({ content: "Le module est déjà activé", ephemeral: true });
                        await Admins.update({ Valeur: true }, { where: { Module: "verify" } });
                    } else {
                        if (checkVerify.Valeur === false) return message.reply({ content: "Le module est déjà désactivé", ephemeral: true });
                        await Admins.update({ Valeur: false }, { where: { Module: "verify" } });
                    }
                }
            }
            await message.reply({ content: "La configuration a bien été enregistrée", ephemeral: true });
        } catch (err) {
            message.reply({ content: "Une erreur est survenue", ephemeral: true });
            console.log(err);
        }
    }
};
