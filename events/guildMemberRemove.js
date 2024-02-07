const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas")
const Admins = require("../modules/Admin")
const Infos = require("../modules/Infos")
const Level = require("../modules/xp")
const Ori = `421416465430741003`

module.exports = async (client, member) => {

    let orisaphir = null;
        try {
            orisaphir = await member.guild.members.fetch(Ori);
            orisaphir = orisaphir.user;
        }
        catch (err) {
            console.log(`Erreur lors de la récupération de Ori : ${err}`);
        }
    
    const MembreID = member.id;
    const search = await Level.findOne({ where: { IDMembre: MembreID } });
    if (search) {
        await Level.destroy({ where: { IDMembre: MembreID } });
    }
    
    if (!member.user.bot) {
        const checkWelcomeLeave = await Admins.findOne({ where: { Module: "WelcomeLeave" } });
        if (checkWelcomeLeave.Valeur === false) return;
        const checkWelcomeLeaveConfig = await Infos.findOne({ where: { Infos: "WelcomeLeave" } });
        if (checkWelcomeLeaveConfig.Valeur === false) return;

        const leaveChannel = member.guild.channels.cache.get(checkWelcomeLeaveConfig.DiscordID)
        //TODO: Trouver un moyen de changer le message de départ via la base de données
        const leaveMessage = `<@${member.id}> était vraiment perdu.e ..`
        const memberCount = member.guild.members.cache.filter(user => !user.user.bot).size;

        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('./img/background.jpg');
        context.drawImage(background, 0, 0, canvas.width, canvas.height)

        context.font = '80px impact';
        context.fillStyle = '#987CC6';
        context.fillText("Au revoir !", canvas.width / 2.5, canvas.height / 1.8);

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profil-image.png' });

        //TODO: Trouver un moyen de changer le titre et le footer de l'embed via la base de données
        const leaveEmbed = new EmbedBuilder()
            .setTitle("**EMERGENCY MEETING !**")
            .setDescription(leaveMessage)
            .setImage('attachment://profil-image.png')
            .setFooter({ text: `Nous ne sommes plus que ${memberCount} énergumènes !` })
            .setColor("Purple")
            .setTimestamp();

        try {
            leaveChannel.send({ embeds: [leaveEmbed], files: [attachment] });
        } catch (err) {
            try {
                checkWelcomeLeave.update({ Valeur: false }, { where: { Module: "WelcomeLeave" } });
                if(orisaphir === null || orisaphir === undefined) {
                    return console.log(`Erreur : ${err}`);
                }
                const embed = new EmbedBuilder()
                    .setTitle('Erreur')
                    .setDescription(`Erreur lors de l'exécution du module WelcomeLeave dans guildMemberRemove.js\n\n\`\`\`js\n${err}\n\`\`\``)
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

    const Stats = await Admins.findOne({ where: { Module: "stats" } });
    if (Stats.Valeur === false) return;
    const StatsMemberConfig = await Infos.findOne({ where: { Infos: "statsmembers" } });
    const StatsBotsConfig = await Infos.findOne({ where: { Infos: "statsbots" } });

    if (StatsMemberConfig.Valeur === true) {
        try {
            const updateMembers = guild => {
                const channel = guild.channels.cache.get(StatsMemberConfig.DiscordID)
                channel.setName(`👤Membres: ${guild.members.cache.filter(member => !member.user.bot).size}`)
            }
            updateMembers(member.guild)
        } catch (err) {
            try {
                StatsMemberConfig.update({ Valeur: false }, { where: { Module: "statsmembers" } });
                if(orisaphir === null || orisaphir === undefined) {
                    return console.log(`Erreur : ${err}`);
                }
                const embed = new EmbedBuilder()
                    .setTitle('Erreur')
                    .setDescription(`Erreur lors de l'exécution du module statsmembers dans guildMemberRemove.js\n\n\`\`\`js\n${err}\n\`\`\``)
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

    if (StatsBotsConfig.Valeur === true) {
        try {
            const updateBots = guild => {
                const channel = guild.channels.cache.get(StatsBotsConfig.DiscordID)
                channel.setName(`🤖Bots: ${guild.members.cache.filter(member => member.user.bot).size}`)
            }
            updateBots(member.guild)
        } catch (err) {
            try {
                StatsBotsConfig.update({ Valeur: false }, { where: { Module: "statsbots" } });
                if(orisaphir === null || orisaphir === undefined) {
                    return console.log(`Erreur : ${err}`);
                }
                const embed = new EmbedBuilder()
                    .setTitle('Erreur')
                    .setDescription(`Erreur lors de l'exécution du module statsbots dans guildMemberRemove.js\n\n\`\`\`js\n${err}\n\`\`\``)
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