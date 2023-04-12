const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stop la musique')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    
    async run(client, message, args) {

        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply({content: `Je peux pas arrêter de jouer de la musique si j'en diffuse pas !`, ephemeral: true});

        if (message.guild.members.me.voice.channel && message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply({content: "Tu ne peux pas me demander ça sans être dans le même channel que moi !", ephemeral: true});

        queue.destroy();

        message.reply({content: "Pas de soucis, j'arrête tout, à bientôt !", ephemeral: true});
    },
};