module.exports = async (client, channel) => {
    const Infos = require('../modules/Infos');
    const Emojis = require('../modules/Emojis');
    const HistoData = require('../modules/HistoData');

    const channelID = channel.id;
    const ServeurID = channel.guild.id;
    const searchInfos = await Infos.findOne({ where: { DiscordID: channelID, IDServeur: ServeurID } });
    const searchEmojis = await Emojis.findAll({ where: { IDChannel: channelID, IDServeur: ServeurID } });
    const searchHisto = await HistoData.findOne({ where: { Channel: channelID, IDServeur: ServeurID } });

    if (searchInfos)
        await Infos.update({ Valeur: false }, { where: { DiscordID: channelID, IDServeur: ServeurID } });
        await Infos.update({ DiscordID: null }, { where: { DiscordID: channelID, IDServeur: ServeurID } });
    if (searchEmojis)
        await Emojis.destroy({ where: { IDChannel: channelID, IDServeur: ServeurID } });
    if (searchHisto)
        await HistoData.update({ Channel: null, Message: null }, { where: { Channel: channelID, IDServeur: ServeurID } });
};