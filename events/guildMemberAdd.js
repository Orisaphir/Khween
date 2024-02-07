const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas")
const Admins = require("../modules/Admin")
const Infos = require("../modules/Infos")
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
    
    if (!member.user.bot) {
        const WelcomeLeave = await Admins.findOne({ where: { Module: "WelcomeLeave" } });
        if (WelcomeLeave.Valeur === false) return;
        const WelcomeLeaveConfig = await Infos.findOne({ where: { Infos: "WelcomeLeave" } });
        if (WelcomeLeaveConfig.Valeur === false) return;

        const welcomeChannel = member.guild.channels.cache.get(WelcomeLeaveConfig.DiscordID)
        //TODO: Trouver un moyen de changer le message de bienvenue via la base de données
        const welcomeMessage = `👀 bah alors, t'es perdu.e, <@${member.id}> !? elle est où ta maman ? 😏`
        const memberCount = member.guild.members.cache.filter(user => !user.user.bot).size;

        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('./img/background.jpg');
        context.drawImage(background, 0, 0, canvas.width, canvas.height)

        context.font = '80px impact';
        context.fillStyle = '#987CC6';
        context.fillText("Bienvenue !", canvas.width / 2.5, canvas.height / 1.8);

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profil-image.png' });

        //TODO: Trouver un moyen de changer le titre et le footer de l'embed via la base de données
        const welcomeEmbed = new EmbedBuilder()
            .setTitle("**OH ! Mais qui c'est que voilà-je !**")
            .setDescription(welcomeMessage)
            .setImage('attachment://profil-image.png')
            .setFooter({ text: `Grâce à toi, nous sommes maintenant ${memberCount} énergumènes ici !` })
            .setColor("Purple")
            .setTimestamp();

        try {
            welcomeChannel.send({ embeds: [welcomeEmbed], files: [attachment] });
        } catch (err) {
            try {
                WelcomeLeave.update({ Valeur: false }, { where: { Module: "WelcomeLeave" } });
                if(orisaphir === null || orisaphir === undefined) {
                    return console.log(`Erreur : ${err}`);
                }
                const embed = new EmbedBuilder()
                    .setTitle('Erreur')
                    .setDescription(`Erreur lors de l'exécution du module WelcomeLeave dans guildMemberAdd.js\n\n\`\`\`js\n${err}\n\`\`\``)
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
                StatsMemberConfig.update({ Valeur: false }, { where: { Infos: "statsmembers" } });
                if(orisaphir === null || orisaphir === undefined) {
                    return console.log(`Erreur : ${err}`);
                }
                const embed = new EmbedBuilder()
                    .setTitle('Erreur')
                    .setDescription(`Erreur lors de l'exécution du module statsmembers dans guildMemberAdd.js\n\n\`\`\`js\n${err}\n\`\`\``)
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
                StatsBotsConfig.update({ Valeur: false }, { where: { Infos: "statsbots" } });
                if(orisaphir === null || orisaphir === undefined) {
                    return console.log(`Erreur : ${err}`);
                }
                const embed = new EmbedBuilder()
                    .setTitle('Erreur')
                    .setDescription(`Erreur lors de l'exécution du module statsbots dans guildMemberAdd.js\n\n\`\`\`js\n${err}\n\`\`\``)
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