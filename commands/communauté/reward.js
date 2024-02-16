const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Reward = require('../../modules/Reward');
const Level = require('../../modules/xp');
const Ori = `421416465430741003`

module.exports = {
    command: new SlashCommandBuilder()
        .setName('reward')
        .setDescription('Ajouter un rôle à un palier de niveau')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(option => option.setName('niveau').setDescription('Niveau du palier').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Rôle à ajouter').setRequired(true)),

    async run(_, message) {
        let orisaphir = null;
        try {
            orisaphir = await message.guild.members.fetch(Ori);
            orisaphir = orisaphir.user;
        }
        catch (err) {
            console.log(`Erreur lors de la récupération de Ori : ${err}`);
        }
        const level = message.options.getInteger('niveau');
        const role = message.options.getRole('role');
        try {
            const IDServeur = message.guild.id;
            if (role.id === IDServeur) return message.reply({ content: `Tu ne peux pas attribuer le rôle @everyone !`, ephemeral: true });
            const rolecheck = message.guild.roles.cache.get(role.id);
            const isAdministrator = rolecheck.permissions.has(PermissionFlagsBits.Administrator);
            if (level < 1) return message.reply({ content: `Le niveau doit être supérieur ou égal à 1 !`, ephemeral: true });
            if (isAdministrator) return message.reply({ content: `Tu ne peux pas attribuer un rôle administrateur à un niveau !`, ephemeral: true });
            if (role.position >= message.member.roles.highest.position) return message.reply({ content: `Le rôle ${role} est au dessus ou égal au miens dans la hiérarchie des rôles, je ne pourrai pas le donner. Merci d'en choisir un autre !`, ephemeral: true });

            const reward = await Reward.findOne({ where: { level: level } });
            const roleAlready = await Reward.findOne({ where: { IDRole: role.id } });
            if (reward) {
                levelrole = reward.IDRole
                return message.reply({ content: `Il y a déjà un rôle pour le niveau ${level} (<@&${levelrole}>) !`, ephemeral: true });
            }
            if (roleAlready) {
                rolelevel = roleAlready.level;
                return message.reply({ content: `Le rôle ${role} est déjà attribué à un niveau **(niveau ${rolelevel})** !`, ephemeral: true });
            }

            await Reward.create({ IDServeur: IDServeur, level: level, IDRole: role.id });
            message.reply({ content: `Le rôle ${role} a été ajouté pour le **niveau ${level}** !` });
        } catch (err) {
            try {
                if(orisaphir === null || orisaphir === undefined) {
                    return console.log(`Erreur : ${err}`);
                }
                const embed = new EmbedBuilder()
                    .setTitle('Erreur')
                    .setDescription(`Erreur lors de l'exécution de la commande /reward\n\n\`\`\`js\n${err}\n\`\`\``)
                    .setColor('#FF0000')
                    .setTimestamp();
                orisaphir.createDM().then(channel => {
                    return channel.send({ embeds: [embed] });
                });
            } catch (errOri) {
                console.log(`Erreur lors de l'envoi de l'erreur à Ori : \n${errOri}\n\nErreur d'origine : \n${err}`);
            }
        };
        try {
            const levels = await Level.findAll();
            if (levels) {
                const Membres = await message.guild.members.fetch();
                Membres.forEach(async (membre) => {
                    const searchMembre = await Level.findOne({ where: { IDMembre: membre.id } });
                    if (searchMembre) {
                        const levelMembre = await searchMembre.get("level");
                        if (levelMembre >= level) {
                            membre.roles.add(role);
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
                    .setDescription(`Erreur de l'ajout du rôle aux membres dans la commande /reward\n\n\`\`\`js\n${err}\n\`\`\``)
                    .setColor('#FF0000')
                    .setTimestamp();
                orisaphir.createDM().then(channel => {
                    return channel.send({ embeds: [embed] });
                });
            } catch (errOri) {
                console.log(`Erreur lors de l'envoi de l'erreur à Ori : \n${errOri}\n\nErreur d'origine : \n${err}`);
            }
        }
    }
};