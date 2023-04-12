const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const maxVol = client.config.opt.maxVol

module.exports = {

    command: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('modifie le volume')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addNumberOption(option => option.setName("nombre").setDescription("volume de 1 à 100").setRequired(false)),
    
    async run(client, message, args) {

        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply({content: `Il n'y a pas de musique diffusée actuellement !`, ephemeral: true});

        if (message.guild.members.me.voice.channel && message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply({content: "Tu ne peux pas me demander ça sans être dans le même channel que moi !", ephemeral: true});

        const vol = message.options.getNumber("nombre");

        if (!vol) return message.reply({ content: `Le volume actuel est de ${queue.volume} 🔊\n*Donne moi un nombre entre **1** et **${maxVol}** pour que je le modifie !*`, ephemeral: true});

        if (queue.volume === vol) return message.reply({ content: `Le volume que tu veux mettre est déjà celui présent !`, ephemeral: true});

        if (vol < 0 || vol > maxVol) return message.reply({content: `Le nombre est invalide !\nJ'ai besoin d'un nombre entre **1** et **${maxVol}** !`, ephemeral: true});

        const success = queue.setVolume(vol);

        return message.reply(success ? {content: `J'ai modifié le volume à **${vol}%** 🔊`, ephemeral: true} : {content: `J'ai eu un soucis lors de la modification !`, ephemeral: true});
    },
};