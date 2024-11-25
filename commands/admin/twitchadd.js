const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { warnPut } = require('../../utils/utils');
const TwitchInfo = require('../../modules/Twitch');
const TwitchChannel = require('../../modules/TwitchChannel');
const { getTwitchInstance } = require('../../twitch/instance');

module.exports = {

    command: new SlashCommandBuilder()
        .setName('twitchadd')
        .setDescription("Permet d'ajouter des chaînes Twitch à surveiller")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options
                .setName("channel")
                .setDescription("Chaîne Twitch à surveiller")
                .setRequired(true)),

    async run(_, message) {
        const ServeurID = message.guild.id;

        const Channel = message.options.getString('channel');
        const TwitchInfos = await TwitchInfo.findOne({ where: { IDServeur: ServeurID } });
        const TwitchChannelInfos = await TwitchChannel.findOne({ where: { IDServeur: ServeurID, Channel: Channel } });

        try {
            if (!TwitchInfos || !TwitchInfos.Valeur) return await message.reply({ content: `Le module Twitch n'est pas activé. Veuillez l'activer avec la commande \`/twitch\``, ephemeral: true });
            if (TwitchChannelInfos) return await message.reply({ content: `La chaîne Twitch \`${Channel}\` est déjà surveillée`, ephemeral: true });
            await TwitchChannel.create({ IDServeur: ServeurID, Channel: Channel });
            
            //infoPut(`Chaînes Twitch surveillées sur le serveur ${ServeurID}:\n\n${TwitchChannelArrays}`);

            let Instance = getTwitchInstance();
            if (!Instance) {
                warnPut(`Erreur lors de la récupération de l'instance Twitch dans twitchadd.js`);
                await TwitchInfo.update({ Valeur: false }, { where: { IDServeur: ServeurID } });
                message.reply({ content: `Erreur lors de la récupération de l'instance Twitch`, ephemeral: true });
                return;
            }
            let instanceChannel = Array.from(Instance.getChannels());
            //infoPut(instanceChannel);
            if (!instanceChannel.includes(Channel))
                Instance.addChannel(Channel);
            //console.log(Instance.getChannels());
            await message.reply({ content: `La chaîne Twitch \`${Channel}\` a bien été ajoutée`, ephemeral: true });

        } catch (err) {
            message.channel.send({ content: 'Une erreur est survenue', ephemeral: true });
            warnPut("Erreur lors de l'ajout de la chaîne Twitch:\n\n" + err);
        }
    }
};
