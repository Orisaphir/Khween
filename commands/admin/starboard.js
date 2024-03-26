const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const Starboard = require('../../modules/Starboard');


module.exports = {

    command: new SlashCommandBuilder()
        .setName('starboard')
        .setDescription("Permet d'activer ou de désactiver le starboard")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((options) =>
            options
                .setName("valeur")
                .setDescription("Valeur de la configuration")
                .setRequired(true)
                .addChoices({ name: 'True', value: 1 }, { name: 'False', value: 0 })
        ),

    async run(_, message) {
        const ServeurID = message.guild.id;
        const Valeur = message.options.get("valeur");
        const StarboardInfos = await Starboard.findOne({ where: { IDServeur: ServeurID } });
        try {
            if (StarboardInfos) {
                if (Valeur.value === 0) {
                    if (StarboardInfos.Valeur === false) return message.reply({ content: "Le starboard est déjà désactivé", ephemeral: true });
                    await Starboard.update({ Valeur: Valeur.value }, { where: { IDServeur: ServeurID } });
                }
                else {
                    if (StarboardInfos.Valeur === true) return message.reply({ content: "Le starboard est déjà activé", ephemeral: true });
                    await Starboard.update({ Valeur: Valeur.value }, { where: { IDServeur: ServeurID } });
                }
            } else {
                if (Valeur.value === 0) {
                    await Starboard.create({ IDServeur: ServeurID, Emoji: "⭐", Reaction: 3, Emoji2: "🌟", Reaction2: 10, Emoji3: "✨", Reaction3: 20, Valeur: false });
                }
                else {
                    await Starboard.create({ IDServeur: ServeurID, Emoji: "⭐", Reaction: 3, Emoji2: "🌟", Reaction2: 10, Emoji3: "✨", Reaction3: 20, Valeur: true });
                }
            }
            await message.reply({ content: "La configuration a bien été enregistrée", ephemeral: true });
        } catch (err) {
            message.reply({ content: "Une erreur est survenue", ephemeral: true });
            console.error("Erreur lors de la config Starboard:\n\n" + err);
        }
    }
};