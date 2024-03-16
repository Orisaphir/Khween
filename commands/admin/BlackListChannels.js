const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const BLChannels = require('../../modules/BlackListChannels');

module.exports = {
    
    command: new SlashCommandBuilder()
        .setName('blacklistchannels')
        .setDescription("Permet de bloquer ou débloquer un salon pour l'XP")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((options) =>
            options
                .setName("channel")
                .setDescription("Salon à bloquer ou débloquer")
                .setRequired(true)),
    
    async run(client, message) {
        const channel = message.options.getChannel('channel');
        const serveurID = message.guild.id;
    
        const search = await BLChannels.findOne({ where: { IDServeur: serveurID, Channel: channel.id } });
    
        if (search) {
            search.destroy();
            message.reply({ content: `Le salon <#${channel.id}> a été débloqué avec succès !`, ephemeral: true });
        } else {
            BLChannels.create({ IDServeur: serveurID, Channel: channel.id });
            message.reply({ content: `Le salon <#${channel.id}> a été bloqué avec succès !`, ephemeral: true });
        }
    }
};