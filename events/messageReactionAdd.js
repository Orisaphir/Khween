const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = async (client, reaction, user) => {
    if(user.bot) return;
    const Emojis = require('../modules/Emojis');
    const Starboardconfig = require('../modules/Starboardconfig');
    const StarboardFiltered = require('../modules/StarboardFiltre');
    const StarboardHisto = require('../modules/StarboardHisto');
    const Starboard = require('../modules/Starboard');
    const message = reaction.message;
    const member = message.channel.guild.members.cache.find(member => member.user === user);

    const messageID = message.id;
    const emojiData = reaction.emoji;
    const serveurID = message.guild.id;

    let emojiName = "";
    if (emojiData.id) {
        emojiName = "<:" + emojiData.name + ":" + emojiData.id + ">";
    }
    else {
        emojiName = reaction.emoji.name;
    }

    if (!emojiName) {
        return;
    }

    const search = await Emojis.findOne({ where: { IDMessage: messageID, IDemoji: emojiName, IDServeur: serveurID } });

    const search2 = await StarboardHisto.findOne({ where: { IDServeur: serveurID, Channel: message.channel.id, Message: messageID } });

    const isActivateStarboard = await Starboard.findOne({ where: { IDServeur: serveurID } });

    const searchStarboardEmoji = await Starboard.findOne({ where: { IDServeur: serveurID, Emoji: emojiName } });
    
    const FilteredStarboard = await StarboardFiltered.findOne({ where: { IDServeur: serveurID, Channel: message.channel.id } });

    if (search) {
        const roleID = search.get('IDrole');

        if (member.roles.cache.find(r => r.id === roleID)) {
            return;
        }

        const role = message.guild.roles.cache.find(r => r.id === roleID);

        if (!role)
            return;

        member.roles.add(role);
    }

    if (search2 && searchStarboardEmoji && isActivateStarboard.Valeur === true) {
        if (FilteredStarboard) {
            const FilteredNeededReaction = FilteredStarboard.get('Reaction');
            if (FilteredNeededReaction <= 0) return;
        }
        const searchStartboardConfig = await Starboardconfig.findOne({ where: { IDServeur: serveurID } });

        const Embed = search2.get('Embed');

        const EmbedChannel = searchStartboardConfig.get('Channel');
        if (message.channel.id === EmbedChannel) return;

        const channel = message.guild.channels.cache.get(EmbedChannel);
        const Message = await channel.messages.fetch(Embed);

        let counts;
        let count;
        try {
            counts = message.reactions.cache.get(emojiName).count;
        } catch (error) {
            counts = message.reactions.cache.get(emojiData.id).count;
        }
        finally {
            count = counts;
        }

        const Reaction1 = searchStarboardEmoji.get('Reaction');
        const Reaction2 = searchStarboardEmoji.get('Reaction2');
        const Reaction3 = searchStarboardEmoji.get('Reaction3');

        let emoji = emojiName;
        if (count >= Reaction1 && count < Reaction2) {
            emoji = emoji;
        } else if (count >= Reaction2 && count < Reaction3) {
            emoji = searchStarboardEmoji.get('Emoji2');
        } else if (count >= Reaction3) {
            emoji = searchStarboardEmoji.get('Emoji3');
        }
        Message.edit(`${emoji} **${count}** | <#${message.channel.id}>`);

        await StarboardHisto.update({ Reaction: count }, { where: { IDServeur: serveurID, Channel: message.channel.id, Message: messageID } });

    }

    if (!search2 && searchStarboardEmoji && isActivateStarboard.Valeur === true) {
        const searchStarboardConfig = await Starboardconfig.findOne({ where: { IDServeur: serveurID } });
        let counts;
        let count;
        try {
            counts = message.reactions.cache.get(emojiName).count;
        } catch (error) {
            counts = message.reactions.cache.get(emojiData.id).count;
        }
        finally {
            count = counts;
        }
        
        let NeededReaction = searchStarboardConfig.get('Reaction');
        const EmbedChannelID = searchStarboardConfig.get('Channel');
        if (message.channel.id === EmbedChannelID) return;
        const EmbedChannel = await message.guild.channels.cache.get(EmbedChannelID);

        if (FilteredStarboard) {
            const FilteredNeededReaction = FilteredStarboard.get('Reaction');
            if (FilteredNeededReaction <= 0) return;
            NeededReaction = FilteredNeededReaction;
        }
        if (count < NeededReaction) return;

        let content = message.content;
        let attachments = message.attachments;
        let files = Array.from(attachments.values());

        if (content === "") {
            content = " ";
        }

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

        const reply = message.reference;
        let buttonReply;
        let embedReply;
        let embeds;
        if (reply) {
            
            const replyMessage = await message.channel.messages.fetch(reply.messageId);
            const replyContent = replyMessage.content;
            const replyAuthor = replyMessage.author;
            const replyAttachments = replyMessage.attachments;

            let files_reply = Array.from(replyAttachments.values());

            const replyUrl = `https://discord.com/channels/${serveurID}/${message.channel.id}/${reply.messageId}`;
            embedReply = new EmbedBuilder()
                .setColor('#2b2d31')
                .setAuthor({ name: `Répond à ${replyAuthor.username}`, iconURL: replyAuthor.displayAvatarURL({ size: 1024, dynamic: true }), url: replyUrl })
                .setDescription(replyContent)
                .setImage(files_reply[0] ? files_reply[0].url : null)
                .setTimestamp(replyMessage.createdTimestamp);
            
            buttonReply = new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Message de référence')
                .setURL(replyUrl);
        }

        const messageUrl = `https://discord.com/channels/${serveurID}/${message.channel.id}/${messageID}`;
        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Message original')
            .setURL(messageUrl);

        const row = new ActionRowBuilder().addComponents(button);
        if (buttonReply) {
            row.addComponents(buttonReply);
        }

        if (files.length > 1) {
            embeds = await createEmbeds(files);
        }

        const embed = new EmbedBuilder()
            .setColor('#e7c819')
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ size: 1024, dynamic: true }), url: messageUrl })
            .setDescription(content)
            .setImage(files[0] ? files[0].url : null)
            .setFooter({ text: `MessageID: ${messageID}` })
            .setTimestamp(message.createdTimestamp);

        let finalEmbeds = embedReply ? [embedReply, embed] : [embed];
        if (embeds) {
            finalEmbeds = [...finalEmbeds, ...embeds];
        }

        await EmbedChannel.send( { 
            content: `${emojiName} **${count}** | <#${message.channel.id}>`,
            files: videoAttachments,
            embeds: finalEmbeds,
            components: [row]
        });

        const Message = await EmbedChannel.messages.fetch({ limit: 1 });
        const EmbedID = Message.first().id;
        const reactStarEmbed = EmbedChannel.messages.fetch(EmbedID).then(msg => msg.react(emojiName));

        await StarboardHisto.create({ IDServeur: serveurID, Channel: message.channel.id, Message: messageID, Reaction: count, Embed: EmbedID });
    }

    async function createEmbeds(files) {
        const embeds = [];
        for (let i = 1; i < files.length; i++) {
            if (files[i].contentType.startsWith('video/') || files[i].contentType.startsWith('audio/')) {
                continue;
            }
            const embed = new EmbedBuilder()
                .setColor('#e7c819')
                .setImage(files[i] ? files[i].url : null)
            embeds.push(embed);
        }
        return embeds;
    }
};