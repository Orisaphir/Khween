const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('affiche la playlist musical actuelle')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async run(client, message, args) {
        const queue = player.getQueue(message.guild.id);

        if (!queue) return message.reply({content: `La playlist est vide !`, ephemeral: true});

        if (!queue.tracks[0]) return message.reply({content: `Il n'y a rien de prévu après la musique actuelle !`, ephemeral: true});

        const embed = new EmbedBuilder();
        const methods = ['', '', '🔁'];
        const methods2 = ['', '🔁', ''];

        embed.setColor('#fd6c9e');
        embed.setThumbnail(message.guild.iconURL({ size: 2048, dynamic: true }));
        embed.setAuthor({ name: `Playlist du serveur ${message.guild.name} ${methods[queue.repeatMode]}`, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })});

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} (demandé par : ${track.requestedBy.username})`);

        const songs = queue.tracks.length;
        const nextSongs = songs > 5 ? `Et **${songs - 5}** autres musiques` : `**${songs}** musique(s) dans la playlist`;

        embed.setDescription(`La musique actuelle est ${queue.current.title}${methods2[queue.repeatMode]}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);

        embed.setTimestamp();
        embed.setFooter({ text: message.user.username, iconURL: message.user.avatarURL({ dynamic: true })});

        message.reply({ embeds: [embed] });
    },
};