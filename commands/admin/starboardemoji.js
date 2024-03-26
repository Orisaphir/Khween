const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const Starboard = require('../../modules/Starboard');
const emojiRegex = require('emoji-regex');

module.exports = {

    command: new SlashCommandBuilder()
        .setName('starboardemoji')
        .setDescription('Permet de configurer la réaction du starboard (⭐ par défaut)')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) => options.setName('emoji').setDescription('Emoji du starboard').setRequired(true))
        .addStringOption((options) => options.setName('emoji2').setDescription('2ème Emoji du starboard (🌟 par défaut)').setRequired(false))
        .addStringOption((options) => options.setName('emoji3').setDescription('3ème Emoji du starboard (✨ par défaut)').setRequired(false)),

    async run(_, message) {
        const regex = emojiRegex();
        const ServeurID = message.guild.id;
        const Emoji = message.options.getString('emoji');
        let Emoji2 = message.options.getString('emoji2');
        let Emoji3 = message.options.getString('emoji3');
        if (!Emoji2) {
            Emoji2 = "🌟"
        } else {
            const regex2 = emojiRegex();
            const emojimessage3 = message.options.getString("emoji").slice(1, -1).split(':')[2];
            let emojicheck3 = message.guild.emojis.cache.get(emojimessage3);
            let emojimessage4 = regex2.exec(message.options.getString("emoji2"))
            const emojicheck4 = (emojimessage4 != null)
            Emoji2 = Emoji2;
            let emojiuni2 = "";
            if (emojimessage4 !== null) {
                emojiuni2 = emojimessage4.input;
                Emoji2 = emojimessage4.input;
            };
            const emojisub2 = emojicheck3 || emojicheck4
            if (!emojisub2) {
                message.reply({ content: "L'émoji 2 indiqué n'existe pas ou n'est pas sur le serveur !", ephemeral: true });
                return;
            };
        }
        if (!Emoji3) { 
            Emoji3 = "✨";
        } else {
            const regex3 = emojiRegex();
            const emojimessage5 = message.options.getString("emoji").slice(1, -1).split(':')[2];
            let emojicheck5 = message.guild.emojis.cache.get(emojimessage5);
            let emojimessage6 = regex3.exec(message.options.getString("emoji3"))
            const emojicheck6 = (emojimessage6 != null)
            Emoji3 = Emoji3;
            let emojiuni3 = "";
            if (emojimessage6 !== null) {
                emojiuni3 = emojimessage6.input;
                Emoji3 = emojimessage6.input;
            };
            const emojisub3 = emojicheck5 || emojicheck6
            if (!emojisub3) {
                message.reply({ content: "L'émoji 3 indiqué n'existe pas ou n'est pas sur le serveur !", ephemeral: true });
                return;
            };
        }

        const StarboardInfos = await Starboard.findOne({ where: { IDServeur: ServeurID } });

        const emojimessage1 = message.options.getString("emoji").slice(1, -1).split(':')[2];
        let emojicheck1 = message.guild.emojis.cache.get(emojimessage1);
        let emojimessage2 = regex.exec(message.options.getString("emoji"))
        const emojicheck2 = (emojimessage2 != null)
        let Emoji1 = Emoji;
        let emojiuni1 = "";
        if (emojimessage2 !== null) {
            emojiuni1 = emojimessage2.input;
            Emoji1 = emojimessage2.input;
        };
        const emojisub1 = emojicheck1 || emojicheck2
        if (!emojisub1) {
            message.reply({ content: "L'émoji 1 indiqué n'existe pas ou n'est pas sur le serveur !", ephemeral: true });
            return;
        };

        try {
            if (StarboardInfos) {
                await Starboard.update({ Emoji: Emoji1, Emoji2: Emoji2, Emoji3: Emoji3 }, { where: { IDServeur: ServeurID } });
            } else {
                await Starboard.create({ IDServeur: ServeurID, Emoji: Emoji1, Reaction: 3, Emoji2: Emoji2, Reaction2: 10, Emoji3: Emoji3, Reaction3: 20 });
            }
            await message.reply({ content: 'La configuration a bien été enregistrée', ephemeral: true });
        } catch (err) {
            message.reply({ content: 'Une erreur est survenue', ephemeral: true });
            console.error("Erreur lors de la config Starboardemoji:\n\n" + err);
        }
    }
};