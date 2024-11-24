const { EmbedBuilder } = require('discord.js');
const Ori = `421416465430741003`
const Infos = require('../modules/Infos');
const Admins = require('../modules/Admin');

async function getdate() {
    let date = new Date();
    let options = { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    let frenchDate = new Intl.DateTimeFormat('fr-FR', options).format(date);

    let timeParts = frenchDate.split(':');
    let heure = timeParts[0];
    let minute = timeParts[1];
    let sec = timeParts[2];

    let message = `${heure}h${minute} et ${sec} secondes`;
    return message;
}


module.exports = async (client, oldState, newState) => {
    const serveurID = oldState.guild.id || newState.guild.id;
    if (oldState.member.user.bot || newState.member.user.bot) return;
    const AdminCheck = await Admins.findOne({ where: { Module: 'VocLogs', IDServeur: serveurID } });
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
        const CheckLogs = await Infos.findOne({ where: { Infos: 'VocLogs', IDServeur: serveurID } });
        if (oldState.channel === null && newState.channel !== null) {
            const user = newState.member.displayName;
            const username = newState.member.user.username;
            const channel = newState.channel;
            const heure = await getdate();
            if (CheckLogs.Valeur === true) {
                const logsChannel = newState.guild.channels.cache.get(CheckLogs.DiscordID);
                const embed = new EmbedBuilder()
                    .setTitle(`Logs de connexion à un salon vocal (${username})`)
                    .setDescription(`**${user}** a rejoint le salon **${channel.name}** à ${heure}`)
                    .setColor('#00FF00')
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
                const logsChannel = oldState.guild.channels.cache.get(CheckLogs.DiscordID);
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
            AdminCheck.update({ Valeur: false }, { where: { Module: 'VocLogs', IDServeur: serveurID } });
            if(orisaphir === null || orisaphir === undefined) {
                return console.log(`Erreur : ${err}`);
            }
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