module.exports = async (client, channel) => {
    const Infos = require('../modules/Infos');
    const Emojis = require('../modules/Emojis');
    const HistoData = require('../modules/HistoData');

    const channelID = channel.id;
    const searchInfos = await Infos.findOne({ where: { DiscordID: channelID } });
    const searchEmojis = await Emojis.findAll({ where: { IDChannel: channelID } });
    const searchHisto = await HistoData.findOne({ where: { Channel: channelID } });

    if (searchInfos)
        await Infos.update({ Valeur: false }, { where: { DiscordID: channelID } });
        await Infos.update({ DiscordID: null }, { where: { DiscordID: channelID } });
    if (searchEmojis)
        await Emojis.destroy({ where: { IDChannel: channelID } });
    if (searchHisto)
        await HistoData.update({ Channel: null, Message: null }, { where: { Channel: channelID } });
};