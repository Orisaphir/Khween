const { PermissionFlagsBits, SlashCommandBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const emojiname = require("emoji-name-map");
const unicode = require("emoji-unicode-map");
const emojiRegex = require('emoji-regex');
const Emojis = require('../../modules/Emojis')

module.exports = {

    command: new SlashCommandBuilder()
        .setName('rr')
        .setDescription('créer un réaction rôle')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option => option.setName("salon").setDescription("Salon où se trouve le message").addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addStringOption(option => option.setName("message").setDescription("ID du message cible").setRequired(true))
        .addStringOption(option => option.setName("emoji").setDescription("Choisis un emoji").setRequired(true))
        .addRoleOption(option => option.setName("rôle").setDescription("Choisis un rôle à attribuer").setRequired(true)),

    async run(client, message, args) {
        const serveurID = message.guild.id;
        const channelID = message.options.getChannel("salon").id;
        const messageID = message.options.getString("message");

        if (isNaN(messageID)) return message.reply({ content: "Tu ne m'as pas donné un ID ! C'est une suite de 17 à 19 chiffres qu'il me faut !", ephemeral: true });
        let messagecheck = await client.channels.cache.get(channelID).messages.fetch(messageID).catch(console.error);
            if (!messagecheck) {
                message.reply({ content: "Soit le message n'existe pas dans le channel que tu m'as donné, soit tu ne m'as pas donné un ID valide !", ephemeral: true });
                return;
            }
        const emojimessage = message.options.getString("emoji").slice(1, -1).split(':')[2];
        let emojicheck = message.guild.emojis.cache.get(emojimessage);
        const regex = emojiRegex();
        let emojimessage2 = regex.exec(message.options.getString("emoji"))
        const emojicheck2 = (emojimessage2 != null)
        let emojiID = message.options.getString("emoji");
        let emojiuni = "";
        if (emojimessage2 !== null) {
            emojiuni = emojimessage2.input;
            emojiID = emojimessage2.input;
        };
        const emojisub = emojicheck || emojicheck2
        if (!emojisub) {
            message.reply({ content: "L'émoji indiqué n'existe pas ou n'est pas sur le serveur !", ephemeral: true });
            return;
        };
        const roleID = message.options.getRole("rôle").id

        try {

            let champs = {
                IDServeur: serveurID,
                IDChannel: channelID,
                IDmessage: messageID,
                IDemoji: emojiID,
                IDrole: roleID
            }
            const emojis = Emojis.create(champs);
            const embed = new EmbedBuilder()
                .setColor('#fd6c9e')
                .setTitle('Récapitulatif')
                .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL({ size: 1024, dynamic: true }) })
                .addFields(
                    { name: 'Channel', value: '<#' + channelID + '>' },
                    { name: 'Message', value: 'https://discord.com/channels/' + serveurID + '/' + channelID + '/' + messageID },
                    { name: 'Emoji', value: emojiID, inline: true },
                    { name: 'Rôle', value: '<@&' + roleID + '>', inline: true },
                )
                .setTimestamp();
            message.reply({ embeds: [embed] })
            const channel = message.guild.channels.cache.get(channelID);
            const msg = channel.messages.fetch(messageID).then(message => message.react(emojiID));
        } catch (err) {

            message.reply({ content: "J'ai eu une erreur !", ephemeral: true })
            console.error(err)
        }
    }
};