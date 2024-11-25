const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { warnPut } = require('../../utils/utils');
const TwitchInfo = require('../../modules/Twitch');
const TwitchChannel = require('../../modules/TwitchChannel');
const { getTwitchInstance, setTwitchInstance } = require('../../twitch/instance');
const twitch = require('../../twitch/twitch');

module.exports = {

    command: new SlashCommandBuilder()
        .setName('twitch')
        .setDescription("Permet d'activer ou de désactiver le module Twitch")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption((options) =>
            options
                .setName("enable")
                .setDescription("Activer ou désactiver le module")
                .setRequired(true)),

    async run(_, message) {
        const ServeurID = message.guild.id;

        const Enable = message.options.getBoolean('enable');
        const TwitchInfos = await TwitchInfo.findOne({ where: { IDServeur: ServeurID } });
        const TwitchChannelInfo = await TwitchChannel.findAll();

        try {
            if (!TwitchInfos) return message.reply({ content: "Le module n'a pas été configuré. Merci de le configurer avec la commande `/twitchsetup`", ephemeral: true });
            await TwitchInfo.update({ Valeur: Enable }, { where: { IDServeur: ServeurID } });
            message.reply({ content: `Le module Twitch a bien été ${Enable ? 'activé' : 'désactivé'}`, ephemeral: true });
            const Instance = getTwitchInstance();
            if (Enable && !Instance) {
                const twitchBot = new twitch(
                    [TwitchInfos.get("Channel")],
                    [],
                    {
                        id: TwitchInfos.get("ClientID"),
                        secret: TwitchInfos.get("ClientSecret"),
                        token: TwitchInfos.get("Token")
                    }
                );
                if (TwitchChannelInfo) {
                    TwitchChannelInfo.forEach(info => {
                        if (!Array.from(twitchBot.getChannels()).includes(info.Channel))
                            twitchBot.addChannel(info.Channel);
                    });
                }
                setTwitchInstance(twitchBot);
            }
        } catch (err) {
            message.reply({ content: 'Une erreur est survenue', ephemeral: true });
            warnPut("Erreur lors de la config Twitch:\n\n" + err);
        }
    }
};