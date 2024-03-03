module.exports = async (client, message) => {
    const Emojis = require('../modules/Emojis');
    const HistoData = require('../modules/HistoData');
    const messageID = message.id;
    const serveurID = message.guild.id;
    const search = await Emojis.findOne({ where: { IDmessage: messageID, IDServeur: serveurID } });
    const searchHisto = await HistoData.findOne({ where: { Message: messageID, IDServeur: serveurID } });
    if (search)
        await Emojis.destroy({ where: { IDmessage: messageID, IDServeur: serveurID } });
    if (searchHisto)
        await HistoData.update({ Message: null }, { where: { Message: messageID, IDServeur: serveurID } })
    
};