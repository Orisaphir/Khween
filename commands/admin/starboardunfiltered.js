const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const StarboardFiltre = require('../../modules/StarboardFiltre');

module.exports = {

    command: new SlashCommandBuilder()
        .setName('starboardunfiltered')
        .setDescription('Permet de supprimer un filtre pour un channel sur le starboard')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((options) => options.setName('channel').setDescription('Channel à défiltrer').setRequired(true)),

    async run(_, message) {
        const ServeurID = message.guild.id;

        const ChannelID = message.options.getChannel('channel');
        const StarboardInfos = await StarboardFiltre.findOne({ where: { IDServeur: ServeurID, Channel: ChannelID.id } });
        
        try {
            if (StarboardInfos) {
                await StarboardFiltre.destroy({ where: { IDServeur: ServeurID, Channel: ChannelID.id } });
            } else {
                return message.reply({ content: 'Ce channel n\'est pas filtré', ephemeral: true });
            }
            await message.reply({ content: `Le salon <#${ChannelID.id}> a bien été défiltré`, ephemeral: true });
        } catch (err) {
            message.reply({ content: 'Une erreur est survenue', ephemeral: true });
            console.error("Erreur lors de la config StarboardFiltre:\n\n" + err);
        }
    }
};
