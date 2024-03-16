const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { Khween } = require('../../app.js');

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
        const Cooldown = message.options.getInteger('cooldown');
        let config = require('../../config.json');
    
        try {
            config.COOLDOWN = Cooldown;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
            Khween.cooldown = Cooldown;
            message.reply({ content: `Le cooldown a été modifié avec succès !`, ephemeral: true });
        } catch (error) {
            console.error(error);
            message.reply({ content: `Une erreur est survenue lors de la modification du cooldown.`, ephemeral: true });
        }
    }
};