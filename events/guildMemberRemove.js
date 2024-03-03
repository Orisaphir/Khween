const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas")
const Admins = require("../modules/Admin")
const Infos = require("../modules/Infos")
const Msg = require("../modules/Msg")
const Level = require("../modules/xp")
const Ori = `421416465430741003`

module.exports = async (client, member) => {

    const serveurID = member.guild.id;

    let orisaphir = null;
        try {
            orisaphir = await member.guild.members.fetch(Ori);
            orisaphir = orisaphir.user;
        }
        catch (err) {
            console.log(`Erreur lors de la récupération de Ori : ${err}`);
        }
    
    const MembreID = member.id;
    const search = await Level.findOne({ where: { IDMembre: MembreID, IDServeur: serveurID } });
    if (search) {
        await Level.destroy({ where: { IDMembre: MembreID, IDServeur: serveurID } });
    }
    
    if (!member.user.bot) {
        const checkWelcomeLeave = await Admins.findOne({ where: { Module: "WelcomeLeave", IDServeur: serveurID } });
        if (checkWelcomeLeave.Valeur === false) return;
        const checkWelcomeLeaveConfig = await Infos.findOne({ where: { Infos: "WelcomeLeave", IDServeur: serveurID } });
        if (checkWelcomeLeaveConfig.Valeur === false) return;

        const leaveChannel = member.guild.channels.cache.get(checkWelcomeLeaveConfig.DiscordID)
        
        let leaveTitle = "Au revoir !"

        const leaveTitleConfig = await Msg.findOne({ where: { Infos: "LeaveTitle", IDServeur: serveurID } });
        const title1 = leaveTitleConfig.Part1;
        let title2 = leaveTitleConfig.Part2;
        if (title2 === null) {
            title2 = "";
        }
        if (title1 !== null) {
            leaveTitle = `${title1} ${title2}`;
        }

        let leaveMessage = `Au revoir <@${member.id}> !`

        const leaveMessageConfig = await Msg.findOne({ where: { Infos: "Leave", IDServeur: serveurID } });
        const msg1 = leaveMessageConfig.Part1;
        const Mention = leaveMessageConfig.Mention;
        let msg2 = leaveMessageConfig.Part2;
        if (msg2 === null) {
            msg2 = "";
        }
        if (msg1 !== null) {
            if (Mention === true) {
                leaveMessage = `${msg1} <@${member.id}> ${msg2}`;
            }
            else {
                leaveMessage = `${msg1} ${msg2}`;
            }
        }

        const memberCount = member.guild.members.cache.filter(user => !user.user.bot).size;

        let leaveFooter = `Nous ne sommes plus que ${memberCount} membres !`

        const leaveFooterConfig = await Msg.findOne({ where: { Infos: "LeaveFooter", IDServeur: serveurID } });
        const footer1 = leaveFooterConfig.Part1;
        const count = leaveFooterConfig.Mention;
        let footer2 = leaveFooterConfig.Part2;
        if (footer2 === null) {
            footer2 = "";
        }
        if (footer1 !== null) {
            if (count === true) {
                leaveFooter = `${footer1} ${memberCount} ${footer2}`;
            }
            else {
                leaveFooter = `${footer1} ${footer2}`;
            }
        }

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

        const leaveEmbed = new EmbedBuilder()
            .setTitle(leaveTitle)
            .setDescription(leaveMessage)
            .setImage('attachment://profil-image.png')
            .setFooter({ text: leaveFooter })
            .setColor("Purple")
            .setTimestamp();

        try {
            leaveChannel.send({ embeds: [leaveEmbed], files: [attachment] });
        } catch (err) {
            try {
                checkWelcomeLeave.update({ Valeur: false }, { where: { Module: "WelcomeLeave", IDServeur: serveurID } });
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

    const Stats = await Admins.findOne({ where: { Module: "stats", IDServeur: serveurID } });
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
                StatsMemberConfig.update({ Valeur: false }, { where: { Module: "statsmembers", IDServeur: serveurID } });
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
                StatsBotsConfig.update({ Valeur: false }, { where: { Module: "statsbots", IDServeur: serveurID } });
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