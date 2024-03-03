const { PermissionFlagsBits, SlashCommandBuilder} = require('discord.js');
const Admins = require('../../modules/Admin')
const Infos = require('../../modules/Infos')
const Histodata = require('../../modules/HistoData')
const Msg = require('../../modules/Msg')

module.exports = {

    command : new SlashCommandBuilder()
        .setName('fillbdd')
        .setDescription(`Pour les utilisateurs antiérieurs à la v0.5.3`)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async run(_, message) {
        
        const serveurID = message.guild.id;
        const searchAdmin = await Admins.findAll({ where: { IDServeur: null } });
        const searchInfos = await Infos.findAll({ where: { IDServeur: null } });
        const searchHistodata = await Histodata.findAll({ where: { IDServeur: null } });
        const searchMsg = await Msg.findAll({ where: { IDServeur: null } });

        let isUpdate = false;

        if (searchAdmin) {
            for (const result of searchAdmin) {
                result.IDServeur = serveurID;
                result.save();
                isUpdate = true;
            }
        }
        if (searchInfos) {
            for (const result of searchInfos) {
                result.IDServeur = serveurID;
                result.save();
                isUpdate = true;
            }
        }
        if (searchHistodata) {
            for (const result of searchHistodata) {
                result.IDServeur = serveurID;
                result.save();
                isUpdate = true;
            }
        }
        if (searchMsg) {
            for (const result of searchMsg) {
                result.IDServeur = serveurID;
                result.save();
                isUpdate = true;
            }
        }

        if (isUpdate) {
            message.reply({ content: `Les bases de données ont été mises à jour avec succès !`, ephemeral: true });
        } else {
            message.reply({ content: `Aucune bases de données n'a eu besoin de mise à jour !`, ephemeral: true });
        }
    }
};
