module.exports = async (client, channel) => {
    const Infos = require('../modules/Infos');
    const Emojis = require('../modules/Emojis');
    const HistoData = require('../modules/HistoData');
    const StarboardHisto = require('../modules/StarboardHisto');
    const StarboardConfig = require('../modules/Starboardconfig');
    const Starboard = require('../modules/Starboard');
    const StarboardFiltre = require('../modules/StarboardFiltre');
    const TwitchInfos = require('../modules/Twitch');

    const channelID = channel.id;
    const ServeurID = channel.guild.id;
    const searchInfos = await Infos.findOne({ where: { DiscordID: channelID, IDServeur: ServeurID } });
    const searchEmojis = await Emojis.findAll({ where: { IDChannel: channelID, IDServeur: ServeurID } });
    const searchHisto = await HistoData.findOne({ where: { Channel: channelID, IDServeur: ServeurID } });
    const searchStarboardHisto = await StarboardHisto.findOne({ where: { Channel: channelID, IDServeur: ServeurID } });
    const searchStarboardConfig = await StarboardConfig.findOne({ where: { IDServeur: ServeurID, Channel: channelID } });
    const searchStarboardFiltre = await StarboardFiltre.findOne({ where: { IDServeur: ServeurID, Channel: channelID } });
    const searchTwitch = await TwitchInfos.findOne({ where: { IDServeur: ServeurID, ChannelAnnounce: channelID } });

    if (searchInfos) {
        await Infos.update({ Valeur: false }, { where: { DiscordID: channelID, IDServeur: ServeurID } });
        await Infos.update({ DiscordID: null }, { where: { DiscordID: channelID, IDServeur: ServeurID } });
    }
    if (searchEmojis)
        await Emojis.destroy({ where: { IDChannel: channelID, IDServeur: ServeurID } });
    if (searchHisto)
        await HistoData.update({ Channel: null, Message: null }, { where: { Channel: channelID, IDServeur: ServeurID } });
    if (searchStarboardHisto)
        await StarboardHisto.destroy({ where: { Channel: channelID, IDServeur: ServeurID } });
    if (searchStarboardConfig) {
        await StarboardConfig.destroy({ where: { IDServeur: ServeurID, Channel: channelID } });
        await Starboard.update({ Valeur: false }, { where: { IDServeur: ServeurID } })
    }
    if (searchStarboardFiltre)
        await StarboardFiltre.destroy({ where: { IDServeur: ServeurID, Channel: channelID } });
    if (searchTwitch)
        await TwitchInfos.destroy({ where: { IDServeur: ServeurID, ChannelAnnounce: channelID } });
};