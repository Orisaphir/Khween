const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('clearqueue')
        .setDescription('passe à la prochaine musique')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async run(client, message, args) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply({content: `Il n'y a pas de musique diffusée actuellement !`, ephemeral: true});

        if (message.guild.members.me.voice.channel && message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply({content: "Tu ne peux pas me demander ça sans être dans le même channel que moi !", ephemeral: true});

        if (!queue.tracks[0]) return message.reply({content: `Je ne peux pas effacer une playlist qui n'existe pas 🤨`, ephemeral: true});

        await queue.clear();

        message.reply({content: `J'ai effacé la playlist !`, ephemeral: true});
    },
};