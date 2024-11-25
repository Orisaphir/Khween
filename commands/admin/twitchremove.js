const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { warnPut } = require('../../utils/utils');
const TwitchInfo = require('../../modules/Twitch');
const TwitchChannel = require('../../modules/TwitchChannel');
const { getTwitchInstance } = require('../../twitch/instance');

module.exports = {

    command: new SlashCommandBuilder()
        .setName('twitchremove')
        .setDescription("Permet de supprimer des chaînes Twitch à surveiller")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options
                .setName("channel")
                .setDescription("Chaîne Twitch à ne plus surveiller")
                .setRequired(true)),

    async run(_, message) {
        const ServeurID = message.guild.id;

        const Channel = message.options.getString('channel');
        const TwitchInfos = await TwitchInfo.findOne({ where: { IDServeur: ServeurID } });
        const TwitchChannelInfos = await TwitchChannel.findOne({ where: { IDServeur: ServeurID, Channel: Channel } });

        try {
            if (!TwitchInfos || !TwitchInfos.Valeur) return await message.reply({ content: `Le module Twitch n'est pas activé. Veuillez l'activer avec la commande \`/twitch\``, ephemeral: true });
            if (!TwitchChannelInfos) return await message.reply({ content: `La chaîne Twitch \`${Channel}\` n'est pas surveillée`, ephemeral: true });
            await TwitchChannel.destroy({ where: { IDServeur: ServeurID, Channel: Channel } });

            let Instance = getTwitchInstance();
            if (!Instance) {
                warnPut(`Erreur lors de la récupération de l'instance Twitch dans twitchadd.js`);
                await TwitchInfo.update({ Valeur: false }, { where: { IDServeur: ServeurID } });
                message.editReply({ content: `Erreur lors de la récupération de l'instance Twitch`, ephemeral: true });
                return;
            }
            // Vérifier si la chaîne est surveillée sur d'autre Serveur
            const ChannelCount = await TwitchChannel.count({ where: { Channel: Channel } });
            let instanceChannel = Array.from(Instance.getChannels());
            if (ChannelCount === 0) {
                if (instanceChannel.includes(Channel))
                    Instance.removeChannel(Channel);
            }
            //console.log(Instance.getChannels());
            await message.reply({ content: `La chaîne Twitch \`${Channel}\` a bien été supprimé`, ephemeral: true });

        } catch (err) {
            message.channel.send({ content: 'Une erreur est survenue', ephemeral: true });
            warnPut("Erreur lors de la suppression de la chaîne Twitch:\n\n" + err);
        }
    }
};
