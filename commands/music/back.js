const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('back')
        .setDescription('revient à la musique précédente')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async run(client, message, args) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply({content: `Il n'y a pas de musique diffusée actuellement !`, ephemeral: true});

        if (message.guild.members.me.voice.channel && message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply({content: "Tu ne peux pas me demander ça sans être dans le même channel que moi !", ephemeral: true});

        if (!queue.previousTracks[1]) return message.reply({content: `Il n'y avait pas de musique avant !`, ephemeral: true});

        await queue.back();

        message.reply({content: `Compris, je te remet la musique d'avant !`, ephemeral: true});
    },
};