const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const Emojis = require('../../modules/Emojis');
const emojiRegex = require('emoji-regex');
const { emoji } = require('emoji-name-map');

module.exports = {
    
    command: new SlashCommandBuilder()
        .setName('rrdelete')
        .setDescription("Permet de supprimer un réaction rôle")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption((options) => options.setName("message").setDescription("ID du message").setRequired(true))
        .addStringOption((options) => options.setName("emoji").setDescription("Emoji").setRequired(true)),

    async run(_, message) {
        let emojimessage = message.options.getString("emoji").slice(1, -1).split(':')[2];
        let emojicheck = message.guild.emojis.cache.get(emojimessage);
        const regex = emojiRegex();
        let emojimessage2 = regex.exec(message.options.getString("emoji"))
        const emojicheck2 = (emojimessage2 != null)
        let emojiID = message.options.getString("emoji");
        if (emojimessage2 !== null) {
            emojiID = emojimessage2.input;
        };
        const Emoji = emojicheck || emojicheck2
        if (!Emoji) {
            message.reply({ content: "L'émoji indiqué n'existe pas ou n'est pas sur le serveur !", ephemeral: true });
            return;
        }
        if (emojicheck === undefined) {
            emojimessage = emojimessage2.input;
        };
        const ForBDD = message.options.getString("emoji");
        const EmojiCheckBDD = await Emojis.findAll({ where: { IDemoji: ForBDD } });
        if (!EmojiCheckBDD || EmojiCheckBDD.length === 0) {
            message.reply({ content: "Cet émoji ne fait parti d'aucun réaction rôle !", ephemeral: true });
            return;
        }
        const MessageID = message.options.getString("message");
        if (isNaN(MessageID)) return message.reply({ content: "Tu ne m'as pas donné un ID ! C'est une suite de 17 à 19 chiffres qu'il me faut !", ephemeral: true });
        const MessageBDD = await Emojis.findAll({ where: { IDmessage: MessageID } });
        if (!MessageBDD || MessageBDD.length === 0) {
            message.reply({ content: "Le message indiqué ne fait pas parti d'un réaction rôle ou l'ID indiqué n'est pas valide !", ephemeral: true });
            return;
        }
        const CorrectLine = await EmojiCheckBDD.find((element) => element.IDmessage === MessageID);
        if (!CorrectLine) {
            message.reply({ content: "L'émoji et le message donné n'ont aucune association d'un réaction rôle ensemble !", ephemeral: true });
            return;
        }
        const msg = await message.guild.channels.cache.get(CorrectLine.IDChannel).messages.fetch(CorrectLine.IDmessage).catch(console.error);

        try {
            const checkAllReact = msg.reactions.cache;
            const checkBotReact = checkAllReact.get(emojimessage);
            if (checkBotReact !== undefined) {
                await msg.reactions.cache.get(emojimessage).remove();
            } else {
                const member = await message.guild.members.fetch(message.user.id);
                member.createDM().then(channel => {
                    return channel.send("Je n'ai pas pu retirer ma réactions sur le message, merci de le faire manuellement au besoin ! https://discord.com/channels/" + CorrectLine.IDServeur + '/' + CorrectLine.IDChannel + '/' + CorrectLine.IDmessage)
                }).catch(console.error)
            }
            await Emojis.destroy({ where: { IDmessage: CorrectLine.IDmessage, IDemoji: CorrectLine.IDemoji } });
            await message.reply({ content: "Le réaction rôle indiqué a bien été supprimé !", ephemeral: true });
        } catch (err) {
            message.reply({ content: "Une erreur est survenue à la suppression du réaction rôle. Merci de contacter @Orisaphir au plus vite.", ephemeral: true });
            console.log(err);
        }
    }
};