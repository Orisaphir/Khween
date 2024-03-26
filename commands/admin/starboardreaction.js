const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const Starboard = require('../../modules/Starboard');
const Starboardconfig = require('../../modules/Starboardconfig');

module.exports = {

    command: new SlashCommandBuilder()
        .setName('starboardreaction')
        .setDescription('Permet de configurer le nombre de réactions pour le starboard (3 par défaut)')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((options) => options.setName('reaction').setDescription('Nombre de réactions minimum').setRequired(true))
        .addIntegerOption((options) => options.setName('reaction2').setDescription('Nombre de réactions minimum pour le 2ème emoji (10 par défaut)').setRequired(false))
        .addIntegerOption((options) => options.setName('reaction3').setDescription('Nombre de réactions minimum pour le 3ème emoji (20 par défaut)').setRequired(false)),

    async run(_, message) {
        const ServeurID = message.guild.id;
        const Reaction = message.options.getInteger('reaction');
        let Reaction2 = message.options.getInteger('reaction2');
        let Reaction3 = message.options.getInteger('reaction3');
        if (!Reaction2) {
            Reaction2 = 10
        }
        if (!Reaction3) {
            Reaction3 = 20
        }

        if (Reaction < 1 || Reaction2 < 1 || Reaction3 < 1) return message.reply({ content: "Le nombre de réactions minimum doit être supérieur à 0", ephemeral: true });

        const StarboardInfos = await Starboard.findOne({ where: { IDServeur: ServeurID } });
        const StarboardconfigInfos = await Starboardconfig.findOne({ where: { IDServeur: ServeurID } });
        try {
            if (StarboardInfos) {
                await Starboard.update({ Reaction: Reaction, Reaction2: Reaction2, Reaction3: Reaction3 }, { where: { IDServeur: ServeurID } });
                if (StarboardconfigInfos) {
                    await Starboardconfig.update({ Reaction: Reaction }, { where: { IDServeur: ServeurID } });
                }
            } else {
                await Starboard.create({ IDServeur: ServeurID, Emoji: "⭐", Reaction: Reaction, Emoji2: "🌟", Reaction2: Reaction2, Emoji3: "✨", Reaction3: Reaction3, Valeur: false });
                if (StarboardconfigInfos) {
                    await Starboardconfig.update({ Reaction: Reaction }, { where: { IDServeur: ServeurID } });
                } else {
                    await Starboardconfig.create({ IDServeur: ServeurID, Reaction: Reaction });
                }
            }
            await message.reply({ content: 'La configuration a bien été enregistrée', ephemeral: true });
        } catch (err) {
            message.reply({ content: 'Une erreur est survenue', ephemeral: true });
            console.error("Erreur lors de la config Starboardemoji:\n\n" + err);
        }
    }
};