const { PermissionFlagsBits, SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const Level = require("../../modules/xp");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('top')
        .setDescription("affiche le top 10 du serveur")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addIntegerOption((options) =>
            options
                .setName("publique")
                .setDescription("Rendre le message publique ?")
                .setRequired(false)
                .addChoices({ name: 'Oui', value: 1 }, { name: 'Non', value: 0 })
        ),

    async run(client, message, args) {

        let eph = true;
        if (message.options.getInteger('publique') === 1) {
            eph = false;
        }

        const serveurID = message.guild.id;
        const search = await Level.findAll({ where: { IDServeur: serveurID }, order: [['level', 'DESC'], ['xp', 'DESC']], limit: 10 });

        if (!search) {
            message.reply({ content: `Personne n'a encore de rank sur ce serveur !`, ephemeral: true });
            return;
        }

        let top = `**Top 10 du serveur**\n\n`;
        let i = 1;
        for (const result of search) {
            const user = await client.users.fetch(result.IDMembre);
            top += `${i}. ${user.globalName} - Level ${result.level} - ${result.xp} XP\n`;
            i++;
        }

        const embed = new EmbedBuilder()
            .setTitle(message.guild.name)
            .setDescription(top)
            .setColor("#007FFF");

        message.reply({ embeds: [embed], ephemeral: eph });
    }
};