const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas")
const Admins = require("../modules/Admin")
const Infos = require("../modules/Infos")
const Msg = require("../modules/Msg")
const Ori = `421416465430741003`

module.exports = async (client, member) => {

    const serveurID = member.guild.id;
    const WelcomeLeave = await Admins.findOne({ where: { Module: "WelcomeLeave", IDServeur: serveurID } });
    const WelcomeLeaveConfig = await Infos.findOne({ where: { Infos: "WelcomeLeave", IDServeur: serveurID } });

    let orisaphir = null;
        try {
            orisaphir = await member.guild.members.fetch(Ori);
            orisaphir = orisaphir.user;
        }
        catch (err) {
            console.log(`Erreur lors de la récupération de Ori : ${err}`);
        }

    if (!member.user.bot && WelcomeLeave.Valeur === true && WelcomeLeaveConfig.Valeur === true) {

        const welcomeChannel = member.guild.channels.cache.get(WelcomeLeaveConfig.DiscordID)
        
        let welcomeTitle = "Bienvenue !"

        const welcomeTitleConfig = await Msg.findOne({ where: { Infos: "WelcomeTitle", IDServeur: serveurID } });
        const title1 = welcomeTitleConfig.Part1;
        let title2 = welcomeTitleConfig.Part2;
        if (title2 === null) {
            title2 = "";
        }
        if (title1 !== null) {
            welcomeTitle = `${title1} ${title2}`;
        }

        let welcomeMessage = `Bienvenue sur le serveur <@${member.id}> !`

        const welcomeMessageConfig = await Msg.findOne({ where: { Infos: "Welcome", IDServeur: serveurID } });
        const msg1 = welcomeMessageConfig.Part1;
        const Mention = welcomeMessageConfig.Mention;
        let msg2 = welcomeMessageConfig.Part2;
        if (msg2 === null) {
            msg2 = "";
        }
        if (msg1 !== null) {
            if (Mention === true) {
                welcomeMessage = `${msg1} <@${member.id}> ${msg2}`;
            }
            else {
                welcomeMessage = `${msg1} ${msg2}`;
            }
        }

        const memberCount = member.guild.members.cache.filter(user => !user.user.bot).size;

        let welcomeFooter = `Nous sommes maintenant ${memberCount} membres !`

        const welcomeFooterConfig = await Msg.findOne({ where: { Infos: "WelcomeFooter", IDServeur: serveurID } });
        const footer1 = welcomeFooterConfig.Part1;
        const count = welcomeFooterConfig.Mention;
        let footer2 = welcomeFooterConfig.Part2;
        if (footer2 === null) {
            footer2 = "";
        }
        if (footer1 !== null) {
            if (count === true) {
                welcomeFooter = `${footer1} ${memberCount} ${footer2}`;
            }
            else {
                welcomeFooter = `${footer1} ${footer2}`;
            }
        }


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

        
        const welcomeEmbed = new EmbedBuilder()
            .setTitle(welcomeTitle)
            .setDescription(welcomeMessage)
            .setImage('attachment://profil-image.png')
            .setFooter({ text: welcomeFooter })
            .setColor("Purple")
            .setTimestamp();

        try {
            welcomeChannel.send({ embeds: [welcomeEmbed], files: [attachment] });
        } catch (err) {
            try {
                WelcomeLeave.update({ Valeur: false }, { where: { Module: "WelcomeLeave", IDServeur: serveurID } });
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
    const StatsMemberConfig = await Infos.findOne({ where: { Infos: "statsmembers", IDServeur: serveurID } });
    const StatsBotsConfig = await Infos.findOne({ where: { Infos: "statsbots", IDServeur: serveurID } });

    if (StatsMemberConfig.Valeur === true) {
        try {
            const updateMembers = guild => {
                const channel = guild.channels.cache.get(StatsMemberConfig.DiscordID)
                channel.setName(`👤Membres: ${guild.members.cache.filter(member => !member.user.bot).size}`)
            }
            updateMembers(member.guild)
        } catch (err) {
            try {
                StatsMemberConfig.update({ Valeur: false }, { where: { Infos: "statsmembers", IDServeur: serveurID } });
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
                StatsBotsConfig.update({ Valeur: false }, { where: { Infos: "statsbots", IDServeur: serveurID } });
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