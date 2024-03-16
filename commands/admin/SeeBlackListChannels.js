const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BLChannels = require('../../modules/BlackListChannels');

module.exports = {

    command: new SlashCommandBuilder()
        .setName('seeblacklistchannels')
        .setDescription("Permet de voir les salons bloqués pour l'XP")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async run(client, message) {
        const serveurID = message.guild.id;

        const search = await BLChannels.findAll({ where: { IDServeur: serveurID } });

        if (search.length === 0) {
            message.reply({ content: `Il n'y a aucun salon bloqué pour l'XP sur ce serveur.`, ephemeral: true });
        } else {
            let list = "";
            for (let i = 0; i < search.length; i++) {
                list += `<#${search[i].Channel}>\n`;
            }
            const embed = new EmbedBuilder()
                .setTitle(`Salons bloqués pour l'XP`)
                .setDescription(list)
                .setColor('#FF0000');
            message.reply({ embeds: [embed], ephemeral: true });
        }
    }
};