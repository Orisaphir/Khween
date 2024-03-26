const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const Starboardconfig = require('../../modules/Starboardconfig');
const Starboard = require('../../modules/Starboard');

module.exports = {

    command: new SlashCommandBuilder()
        .setName('starboardconfig')
        .setDescription('Permet de configurer le starboard')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((options) => options.setName('channel').setDescription('Channel du starboard').setRequired(true))
        .addIntegerOption((options) => options.setName('reaction').setDescription('Nombre de réactions minimum').setRequired(true)),

    async run(_, message) {
        const ServeurID = message.guild.id;

        const ChannelID = message.options.getChannel('channel');
        const Reaction = message.options.getInteger('reaction');
        const StarboardInfos = await Starboardconfig.findOne({ where: { IDServeur: ServeurID } });
        const StarboardInfos2 = await Starboard.findOne({ where: { IDServeur: ServeurID } });
        
        try {
            if (StarboardInfos) {
                await Starboardconfig.update({ Channel: ChannelID.id, Reaction: Reaction }, { where: { IDServeur: ServeurID } });
                if (StarboardInfos2) {
                    await Starboard.update({ Reaction: Reaction }, { where: { IDServeur: ServeurID } });
                }
            } else {
                await Starboardconfig.create({ IDServeur: ServeurID, Channel: ChannelID.id, Reaction: Reaction });
                if (StarboardInfos2) {
                    await Starboard.update({ Reaction: Reaction }, { where: { IDServeur: ServeurID } });
                } else {
                    await Starboard.create({ IDServeur: ServeurID, Emoji: "⭐", Reaction: Reaction, Emoji2: "🌟", Reaction2: 10, Emoji3: "✨", Reaction3: 20, Valeur: false });
                }
            }
            await message.reply({ content: 'La configuration a bien été enregistrée', ephemeral: true });
        } catch (err) {
            message.reply({ content: 'Une erreur est survenue', ephemeral: true });
            console.error("Erreur lors de la config Starboardconfig:\n\n" + err);
        }
    }
};
