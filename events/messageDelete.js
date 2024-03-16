const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = async (client, message) => {
    const Emojis = require('../modules/Emojis');
    const HistoData = require('../modules/HistoData');
    const Infos = require('../modules/Infos');
    const Admins = require('../modules/Admin');
    const messageID = message.id;
    const serveurID = message.guild.id;
    const search = await Emojis.findOne({ where: { IDmessage: messageID, IDServeur: serveurID } });
    const searchHisto = await HistoData.findOne({ where: { Message: messageID, IDServeur: serveurID } });
    if (search)
        await Emojis.destroy({ where: { IDmessage: messageID, IDServeur: serveurID } });
    if (searchHisto)
        await HistoData.update({ Message: null }, { where: { Message: messageID, IDServeur: serveurID } })

    const LogChannel = await Infos.findOne({ where: { Infos: "logs", IDServeur: serveurID } });
    const LogOn = await Admins.findOne({ where: { Module: "logs", IDServeur: serveurID } });
    const fetchLog = await message.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete
    });
    const logmember = fetchLog.entries.first();
    const { executorId } = logmember;
    const executoruser = await message.guild.members.fetch(executorId);
    const executor = `<@${executoruser.user.id}>`;
    if (LogOn.Valeur === true && LogChannel.DiscordID !== null) {
        const log = message.guild.channels.cache.get(LogChannel.DiscordID);
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Message supprimé')
            .setDescription(`**Auteur:** ${message.author}\n\n**Salon:** ${message.channel}\n\n**Contenu:**\n${message.content}`)
            .setFields(
                { name: 'Supprimé par', value: executor, inline: true}
            )
            .setTimestamp();
        log.send({ embeds: [embed] });
    }
};