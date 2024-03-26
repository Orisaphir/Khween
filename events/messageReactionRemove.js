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

    const search = await Emojis.findOne({ where: { IDMessage: messageID, IDemoji:emojiName, IDServeur: serveurID } });

    const search2 = await StarboardHisto.findOne({ where: { IDServeur: serveurID, Channel: message.channel.id, Message: messageID } });

    const isActivateStarboard = await Starboard.findOne({ where: { IDServeur: serveurID } });

    const searchStarboardEmoji = await Starboard.findOne({ where: { IDServeur: serveurID, Emoji: emojiName } });

    
    if (search) {
        const roleID = search.get('IDrole');

        if (!member.roles.cache.find(r => r.id === roleID)) {
            return;
        }

        const role = message.guild.roles.cache.find(r => r.id === roleID);

        if (!role)
            return;

        member.roles.remove(role);
    }

    if (search2 && searchStarboardEmoji && isActivateStarboard.Valeur === true) {
        const searchStartboardConfig = await Starboardconfig.findOne({ where: { IDServeur: serveurID } });
        const FilteredStarboard = await StarboardFiltered.findOne({ where: { IDServeur: serveurID, Channel: message.channel.id } });

        const Embed = search2.get('Embed');

        const EmbedChannel = searchStartboardConfig.get('Channel');
        if (message.channel.id === EmbedChannel) return;

        const channel = message.guild.channels.cache.get(EmbedChannel);
        const Message = await channel.messages.fetch(Embed);

        let reactions;
        try {
            reactions = message.reactions.cache.get(emojiName);
            if (!reactions) {
                throw new Error('Emoji not found');
            }
        } catch (error) {
            reactions = message.reactions.cache.get(emojiData.id);
        }
        finally {
            reactions = reactions
        }
        const count = reactions ? reactions.count : 0;

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

        if (FilteredStarboard) {
            const FilteredReaction = FilteredStarboard.get('Reaction');
            if (FilteredReaction <= 0) return;
            if (count < FilteredReaction) {
                Message.delete();
                await StarboardHisto.destroy({ where: { IDServeur: serveurID, Channel: message.channel.id, Message: messageID } });
                return;
            }
        }
        if (count < Reaction1) {
            Message.delete();
            await StarboardHisto.destroy({ where: { IDServeur: serveurID, Channel: message.channel.id, Message: messageID } });
            return;
        }

        Message.edit(`${emoji} **${count}** | <#${message.channel.id}>`);

        await StarboardHisto.update({ Reaction: count }, { where: { IDServeur: serveurID, Channel: message.channel.id, Message: messageID } });

    }
};