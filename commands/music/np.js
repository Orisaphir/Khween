const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('np')
        .setDescription('montre la musique actuellement joué')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async run(client, message, args) {

        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send({content: `Il n'y a pas de musique diffusée actuellement !`, ephemeral: true});

        const track = queue.current;

        const embed = new EmbedBuilder();

        embed.setColor('#fd6c9e');
        embed.setThumbnail(track.thumbnail);
        embed.setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) });

        const methods = ['désactivé', 'musique', 'playlist'];

        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == 'Infinity' ? 'En live' : track.duration;

        embed.setDescription(`Volume: **${queue.volume}**%\nDurée: **${trackDuration}**\nEn boucle: **${methods[queue.repeatMode]}**\nDemandé par: ${track.requestedBy}`);

        embed.setTimestamp();
        embed.setFooter({ text: message.user.username, iconURL: message.user.avatarURL({ dynamic: true }) });

        message.reply({ embeds: [embed] });
    },
}