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
    let fetchLog = await message.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete
    });
    let logmember = fetchLog.entries.first();
    let { executorId } = logmember;
    let executoruser = await message.guild.members.fetch(executorId);
    let executor = `<@${executoruser.user.id}>`;
    if (logmember.createdTimestamp < Date.now() - 1500) {
        executor = `${message.author}`;
    }
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