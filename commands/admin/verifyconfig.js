const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const Admins = require('../../modules/Admin');
const Infos = require('../../modules/Infos');

module.exports = {

    command : new SlashCommandBuilder()
        .setName('verifyconfig')
        .setDescription("Permet de configurer la vérification")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) => options.setName("channel").setDescription("ID du channel de vérification").setRequired(true))
        .addRoleOption((options) => options.setName("rôle").setDescription("Rôle qui sera donné").setRequired(true)),

    async run(_, message) {
        const ServeurID = message.guild.id;

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

        const ChannelID = message.options.getString("channel");
        const Role = message.options.getRole("rôle");
        const checkChannel = await message.guild.channels.cache.get(ChannelID);
        const adminInfos = await Admins.findOne({ where: { Module: "verify", IDServeur: ServeurID } });
        if (!adminInfos) await Admins.create({ IDServeur: ServeurID, Module: "verify", Valeur: false });
        
        if (isNaN(ChannelID)) return message.reply({ content: "Tu ne m'as pas donné un ID ! C'est une suite de 17 à 19 chiffres qu'il me faut !", ephemeral: true });
        if (!checkChannel) return message.reply({ content: "L'ID indiqué n'est pas valide !", ephemeral: true });
        if (checkChannel.type !== 0) return message.reply({ content: "L'ID indiqué n'est pas un salon !", ephemeral: true });
        if (!Role) return message.reply({ content: "Le rôle indiqué n'est pas valide !", ephemeral: true });
        if (Role.position >= message.member.roles.highest.position) return message.reply({ content: "Le rôle indiqué est au dessus ou égal au miens dans la hiérarchie des rôles, je ne pourrai pas le donner. Merci d'en choisir un autre !", ephemeral: true });

        try {
            await Infos.findOne({ where: { Infos: "verifychannel", IDServeur: ServeurID } }).then(async (data) => {
                if (data) {
                    await Infos.update({ DiscordID: ChannelID, Valeur: true }, { where: { Infos: "verifychannel", IDServeur: ServeurID } });
                } else {
                    await Infos.create({ IDServeur: ServeurID, Infos: "verifychannel", DiscordID: ChannelID, Valeur: true });
                }
            });
            await Infos.findOne({ where: { Infos: "verifyrole", IDServeur: ServeurID } }).then(async (data) => {
                if (data) {
                    await Infos.update({ DiscordID: Role.id, Valeur: true }, { where: { Infos: "verifyrole", IDServeur: ServeurID } });
                } else {
                    await Infos.create({ IDServeur: ServeurID, Infos: "verifyrole", DiscordID: Role.id, Valeur: true });
                }
            });
            if (adminInfos.Valeur === false) await Admins.update({ Valeur: true }, { where: { Module: "verify", IDServeur: ServeurID } });
            await message.reply({ content: "La configuration a bien été enregistrée", ephemeral: true });
        }
        catch (err) {
            message.reply({ content: "Une erreur est survenue", ephemeral: true });
            console.log(err);
        }
    }
};