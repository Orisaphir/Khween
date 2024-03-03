const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Reward = require('../../modules/Reward');
const Level = require('../../modules/xp');
const Ori = `421416465430741003`

module.exports = {
    command: new SlashCommandBuilder()
        .setName('unreward')
        .setDescription('Supprimer un rôle à un palier de niveau')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(option => option.setName('niveau').setDescription('Niveau du palier').setRequired(false))
        .addRoleOption(option => option.setName('role').setDescription('Rôle à supprimer').setRequired(false)),

    async run(_, message) {
        let orisaphir = null;

        try {
            orisaphir = await message.guild.members.fetch(Ori);
            orisaphir = orisaphir.user;
        }
        catch (err) {
            console.log(`Erreur lors de la récupération de Ori : ${err}`);
        }
        let level = null;
        let role = null;
        const IDServeur = message.guild.id;
        try {
            if (message.options.getInteger('niveau')) {
                level = message.options.getInteger('niveau');
            }
            if (message.options.getRole('role')) {
                role = message.options.getRole('role');
            }

            if (level === null && role === null) return message.reply({ content: `Tu dois spécifier un niveau ou un rôle !`, ephemeral: true });
            if (level !== null && role !== null) {
                const reward = await Reward.findOne({ where: { IDServeur: IDServeur, level: level, IDRole: role.id } });
                if (!reward) return message.reply({ content: `Le rôle ${role} n'est pas attribué au niveau ${level} !`, ephemeral: true });
                await Reward.destroy({ where: { IDServeur: IDServeur, level: level, IDRole: role.id } });
                await message.reply({ content: `Le rôle ${role} a été supprimé pour le **niveau ${level}** !` });
            }
            if (level !== null && role === null) {
                const reward = await Reward.findOne({ where: { IDServeur: IDServeur, Level: level } });
                if (!reward) return message.reply({ content: `Il n'y a pas de rôle attribué pour le **niveau ${level}** !`, ephemeral: true });
                role = message.guild.roles.cache.get(reward.IDRole);
                await Reward.destroy({ where: { IDServeur: IDServeur, level: level } });
                await message.reply({ content: `Le rôle pour le niveau ${level} a été supprimé (${role}) !` });
            }
            if (level === null && role !== null) {
                const reward = await Reward.findOne({ where: { IDServeur: IDServeur, IDRole: role.id } });
                if (!reward) return message.reply({ content: `Le rôle ${role} n'est pas attribué à un niveau !`, ephemeral: true });
                level = reward.level;
                await Reward.destroy({ where: { IDServeur: IDServeur, IDRole: role.id } });
                await message.reply({ content: `Le rôle ${role} a été supprimé des récompenses du **niveau ${level}** !` });
            }
        } catch (err) {
            try {
                if(orisaphir === null || orisaphir === undefined) {
                    return console.log(`Erreur : ${err}`);
                }
                const embed = new EmbedBuilder()
                    .setTitle('Erreur')
                    .setDescription(`Erreur lors de l'exécution de la commande /unreward\n\n\`\`\`js\n${err}\n\`\`\``)
                    .setColor('#FF0000')
                    .setTimestamp();
                orisaphir.createDM().then(channel => {
                    return channel.send({ embeds: [embed] });
                });
            } catch (err) {
                console.log(`Erreur : ${err}`);
            }
        }

        try {
            const levels = await Level.findAll();
            if (levels) {
                const Membres = await message.guild.members.fetch();
                Membres.forEach(async (membre) => {
                    const searchMembre = await Level.findOne({ where: { IDMembre: membre.id }, IDServeur: IDServeur });
                    if (searchMembre) {
                        const levelMembre = await searchMembre.get("level");
                        if (levelMembre >= level) {
                            membre.roles.remove(role);
                        }
                    }
                });
            }
        } catch (err) {
            try {
                if(orisaphir === null || orisaphir === undefined) {
                    return console.log(`Erreur : ${err}`);
                }
                const embed = new EmbedBuilder()
                    .setTitle('Erreur')
                    .setDescription(`Erreur lors de la suppression du rôle aux membres dans la commande /unreward\n\n\`\`\`js\n${err}\n\`\`\``)
                    .setColor('#FF0000')
                    .setTimestamp();
                orisaphir.createDM().then(channel => {
                    return channel.send({ embeds: [embed] });
                });
            } catch (err) {
                console.log(`Erreur : ${err}`);
            }
        }
    }
};