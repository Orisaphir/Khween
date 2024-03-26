const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const axios = require('axios');

module.exports = async (client, message) => {
    const Emojis = require('../modules/Emojis');
    const HistoData = require('../modules/HistoData');
    const Infos = require('../modules/Infos');
    const Admins = require('../modules/Admin');
    const StarboardHisto = require('../modules/StarboardHisto');
    const messageID = message.id;
    const serveurID = message.guild.id;
    const search = await Emojis.findOne({ where: { IDmessage: messageID, IDServeur: serveurID } });
    const searchHisto = await HistoData.findOne({ where: { Message: messageID, IDServeur: serveurID } });
    const searchStarbordHisto = await StarboardHisto.findOne({ where: { Message: messageID, IDServeur: serveurID } });
    const searchStarbordHisto2 = await StarboardHisto.findOne({ where: { Embed: messageID, IDServeur: serveurID } });
    let isEmbed = null;
    if (searchStarbordHisto2) {
        isEmbed = searchStarbordHisto2.get('Embed');
    }
    if (search)
        await Emojis.destroy({ where: { IDmessage: messageID, IDServeur: serveurID } });
    if (searchHisto)
        await HistoData.update({ Message: null }, { where: { Message: messageID, IDServeur: serveurID } })
    if (searchStarbordHisto || searchStarbordHisto2) {
        if (isEmbed === messageID) {
            await StarboardHisto.destroy({ where: { Embed: messageID, IDServeur: serveurID } });
        }
        else {
            await StarboardHisto.destroy({ where: { Message: messageID, IDServeur: serveurID } });
        }
    }
        

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
        let attachments = message.attachments;
        let files = Array.from(attachments.values());
        let embeds;
        let ExistingEmbeds;
        let videoAttachments = [];
        let totalSize = 0;
        if (message.attachments.size > 0) {
            message.attachments.forEach(attachment => {
            if (attachment.contentType.startsWith('video/') || attachment.contentType.startsWith('audio/') && totalSize + attachment.size <= 8000000) {
                videoAttachments.push(attachment.url);
                totalSize += attachment.size;
            }
            });
        }
        if (files.length > 0) {
            embeds = await createEmbeds(files);
        }
        let imageEmbeds = message.embeds.filter(embed => embed.image && embed.image.url !== null && embed.image.url !== undefined);
        if (imageEmbeds.length > 0) {
            let allEmbeds = [];
            for (let i = 0; i < imageEmbeds.length; i++) {
                const response = await axios.head(imageEmbeds[i].image.url);
                if (response.headers['content-type'].startsWith('image/')) {
                    let newMessage = {...message, embeds: [imageEmbeds[i]]};
                    let embeds = await getEmbeds(newMessage);
                    allEmbeds.push(...embeds);
                }
            }
            ExistingEmbeds = allEmbeds;
        }

        const log = message.guild.channels.cache.get(LogChannel.DiscordID);
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Message supprimé')
            .setDescription(`**Auteur:** ${message.author}\n\n**Salon:** ${message.channel}\n\n**Contenu:**\n${message.content}`)
            .setFields(
                { name: 'Supprimé par', value: executor, inline: true}
            )
            .setTimestamp();
        let finalEmbeds = [embed];
        if (embeds) {
            finalEmbeds = [...finalEmbeds, ...embeds];
        }
        if (ExistingEmbeds) {
            finalEmbeds = [...finalEmbeds, ...ExistingEmbeds];
        }
        log.send({ 
            embeds: finalEmbeds,
            files: videoAttachments,
        });
    }

    async function createEmbeds(files) {
        const embeds = [];
        for (let i = 0; i < files.length; i++) {
            if (files[i].contentType.startsWith('video/') || files[i].contentType.startsWith('audio/')) {
                continue;
            }
            const embed = new EmbedBuilder()
                .setColor('#2b2d31')
                .setImage(files[i] ? files[i].url : null)
            embeds.push(embed);
        }
        return embeds;
    }
    async function getEmbeds(message) {
        const allembeds = [];
        for (let i = 0; i < message.embeds.length; i++) {
            const embedData = message.embeds[i];
            if (embedData.image && embedData.image.url) {
                const response = await axios.head(embedData.image.url);
                if (response.headers['content-type'].startsWith('image/')) {
                    const embed = new EmbedBuilder()
                        .setColor('#2b2d31')
                        .setImage(embedData.image.url);
                    allembeds.push(embed);
                }
            }
        }
        return allembeds;
    }
};