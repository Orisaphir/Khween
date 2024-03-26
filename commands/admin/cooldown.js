const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const Cooldown = require('../../modules/Cooldown');

module.exports = {
    
    command: new SlashCommandBuilder()
        .setName('cooldown')
        .setDescription("Permet de changer le cooldown pour le gain d'XP (en secondes). 0 par défaut.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((options) =>
            options
                .setName("cooldown")
                .setDescription("Temps de cooldown en seconde (0 pour désactiver)")
                .setRequired(true)),
    
    async run(_, message) {
        const CD = message.options.getInteger('cooldown');
        const CDConfig = await Cooldown.findOne({ where: { IDServeur: message.guild.id } });
    
        try {
            if (!CDConfig) {
                await Cooldown.create({ IDServeur: message.guild.id, cooldown: CD });
            } else {
                await Cooldown.update({ cooldown: CD }, { where: { IDServeur: message.guild.id } });
            }
            message.reply({ content: `Le cooldown a été modifié avec succès !`, ephemeral: true });
        } catch (error) {
            console.error(error);
            message.reply({ content: `Une erreur est survenue lors de la modification du cooldown.`, ephemeral: true });
        }
    }
};