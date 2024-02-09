module.exports = async (client, message) => {
    const Emojis = require('../modules/Emojis');
    const HistoData = require('../modules/HistoData');
    const messageID = message.id;
    const search = await Emojis.findOne({ where: { IDmessage: messageID } });
    const searchHisto = await HistoData.findOne({ where: { Message: messageID } });
    if (search)
        await Emojis.destroy({ where: { IDmessage: messageID } });
    if (searchHisto)
        await HistoData.update({ Message: null }, { where: { Message: messageID } })
    
};