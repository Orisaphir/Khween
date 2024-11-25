const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { warnPut } = require('../../utils/utils');
const TwitchInfo = require('../../modules/Twitch');

module.exports = {
        
    command: new SlashCommandBuilder()
        .setName('twitchchannel')
        .setDescription("Permet de configurer le salon Twitch")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((options) =>
            options
                .setName("channel")
                .setDescription("Salon pour les notifications Twitch")
                .setRequired(true)),

    async run(_, message) {
        const ServeurID = message.guild.id;

        const ChannelID = message.options.getChannel('channel');
        const TwitchInfos = await TwitchInfo.findOne({ where: { IDServeur: ServeurID } });
        
        try {
            if (!TwitchInfos || !TwitchInfos.Valeur) return await message.reply({ content: `Le module Twitch n'est pas activé. Veuillez l'activer avec la commande \`/twitch\``, ephemeral: true });
            await TwitchInfo.update({ ChannelAnnounce: ChannelID.id }, { where: { IDServeur: ServeurID } });
            await message.reply({ content: 'La configuration a bien été enregistrée', ephemeral: true });
        } catch (err) {
            message.channel.send({ content: 'Une erreur est survenue', ephemeral: true });
            warnPut("Erreur lors de la config TwitchChannel:\n\n" + err);
        }
    }
};