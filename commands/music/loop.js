const { QueueRepeatMode } = require('discord-player');
const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('active/désactive une loop')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption(option => option.setName("choix").setDescription("boucler la musique ou la playlist / arrêter la boucle").setChoices({ name: 'Playlist', value: 'enable_loop_queue' }, { name: 'Off', value: 'disable_loop'}, { name: 'Musique', value: 'enable_loop_song' },).setRequired(true)),

    async run(client, message, args) {
        const queue = player.getQueue(message.guild.id);

        try {
            if (!queue || !queue.playing) return message.reply({ content: `Il n'y a pas de musique diffusée actuellement !`, ephemeral: true });

            if (message.guild.members.me.voice.channel && message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply({ content: "Tu ne peux pas me demander ça sans être dans le même channel que moi !", ephemeral: true });

            switch (message.options._hoistedOptions.map(x => x.value).toString()) {
                case 'enable_loop_queue': {
                    if (queue.repeatMode === 1) return message.reply({ content:`Tu dois d'abord retirer la boucle sur la musique actuelle !`, ephemeral: true });
    
                    const success = queue.setRepeatMode( QueueRepeatMode.QUEUE);
    
                    return message.reply({ content:success ? `Je joue maintenant la playlist en boucle !` : `J'ai eu une erreur lors de la mise en boucle !`, ephemeral: true });
                    break
                }
                case 'disable_loop': {
                    const success = queue.setRepeatMode(QueueRepeatMode.OFF);
    
                    return message.reply({ content:success ? `La boucle a bien été désactivé !` : `J'ai eu une erreur lors de l'arrêt de la boucle !`, ephemeral: true });
                    break
                }
                case 'enable_loop_song': {
                    if (queue.repeatMode === 2) return message.reply({ content:`Tu dois d'abord retirer la boucle sur la playlist !`, ephemeral: true });
    
                    const success = queue.setRepeatMode( QueueRepeatMode.TRACK);
                    
                    return message.reply({ content:success ? `Je joue maintenant la musique en boucle !` : `J'ai eu une erreur lors de la mise en boucle !`, ephemeral: true });
                    break
                }
            }
        } catch { }
    },
};