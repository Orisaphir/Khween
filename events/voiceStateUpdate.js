const { EmbedBuilder } = require('discord.js');
const Ori = `421416465430741003`
const Infos = require('../modules/Infos');
const Admins = require('../modules/Admin');

async function getdate() {
    let date = new Date();
	let heure = date.getHours();
	if (heure < 10) {
		heure = "0" + heure;
	}
	let minute = date.getMinutes();
	if (minute < 10) {
		minute = "0" + minute;
	}
    let sec = date.getSeconds();
    if (sec < 10) {
        sec = "0" + sec;
    }
	let message = `${heure}h${minute} et ${sec} secondes`;
	return message;
}


module.exports = async (client, oldState, newState) => {
    if (oldState.member.user.bot || newState.member.user.bot) return;
    const AdminCheck = await Admins.findOne({ where: { Module: 'logs' } });
    if (AdminCheck.Valeur === false) return;
    let orisaphir = null;
    try {
        orisaphir = await newState.guild.members.fetch(Ori) || await oldState.guild.members.fetch(Ori);
        orisaphir = orisaphir.user;
    }
    catch (err) {
        console.log(`Erreur lors de la récupération de Ori : ${err}`);
    }
    try {
        const CheckLogs = await Infos.findOne({ where: { Infos: 'logs' } });
        if (oldState.channel === null && newState.channel !== null) {
            const user = newState.member.displayName;
            const username = newState.member.user.username;
            const channel = newState.channel;
            const heure = await getdate();
            if (CheckLogs.Valeur === true) {
                const logsInfo = await Infos.findOne( { where: { Infos: 'logs' } });
                const logsChannel = newState.guild.channels.cache.get(logsInfo.DiscordID);
                const embed = new EmbedBuilder()
                    .setTitle(`Logs de connexion à un salon vocal (${username})`)
                    .setDescription(`**${user}** a rejoint le salon **${channel.name}** à ${heure}`)
                    .setColor('#FF0000')
                    .setTimestamp();
                logsChannel.send({ embeds: [embed] });
            }
            return;
        }
        if (oldState.channel !== null && newState.channel === null) {
            const user = oldState.member.displayName;
            const username = oldState.member.user.username;
            const channel = oldState.channel;
            const heure = await getdate();
            if (CheckLogs.Valeur === true) {
                const logsInfo = await Infos.findOne( { where: { Infos: 'logs' } });
                const logsChannel = oldState.guild.channels.cache.get(logsInfo.DiscordID);
                const embed = new EmbedBuilder()
                    .setTitle(`Logs de déconnexion à un salon vocal (${username})`)
                    .setDescription(`**${user}** a quitté le salon **${channel.name}** à ${heure}`)
                    .setColor('#FF0000')
                    .setTimestamp();
                logsChannel.send({ embeds: [embed] });
            }
            return;
        }
    } catch (err) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('Erreur')
                .setDescription(`Erreur lors de l'exécution du fichier voiceStateUpdate.js\n\n\`\`\`js\n${err}\n\`\`\``)
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