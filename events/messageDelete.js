module.exports = async (client, message) => {
    const Emojis = require('../modules/Emojis');
    const messageID = message.id;
    const search = await Emojis.findOne({ where: { IDmessage: messageID } });
    if (!search)
        return;
    await Emojis.destroy({ where: { IDmessage: messageID } });
};