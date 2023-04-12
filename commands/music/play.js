const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { QueryType } = require('discord-player');

module.exports = {

    command: new SlashCommandBuilder()
        .setName('play')
        .setDescription('joue de la musique')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption(option => option.setName("musique").setDescription("mot clé de la musique/lien").setMaxLength(2000).setRequired(true)),
    
    async run(client, message, args) {

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply({ content: "Tu dois être dans un salon vocal pour me demander ça !", ephemeral: true});
        if (message.guild.members.me.voice.channel && message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply({content: "Tu ne peux pas me demander ça sans être dans le même channel que moi !", ephemeral: true});

        const song = message.options.getString('musique');
        const validate = await player.search(song, {
            requestedBy: message.member,
            searchEngine: QueryType.AUTO
        });
        
        if (!validate || !validate.tracks.length) return message.reply({content: `Je n'ai trouvé aucun résultat à ta demande ${message.author} D:`, ephemeral: true});

        const queue = await player.createQueue(message.guild, {
            metadata: message.channel,
            initialVolume: client.config.opt.defaultvolume,
            leaveOnEnd: client.config.opt.leaveOnEnd
        });

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
            message.reply({content: "Noté !", ephemeral: true})
        } catch {
            await player.deleteQueue(message.guild.id);
            return message.reply({content: `Je ne peux pas rejoindre le vocal ${message.author} ;-;`, ephemeral: true});
        }

        validate.playlist ? queue.addTracks(validate.tracks) : queue.addTrack(validate.tracks[0]);

        if (!queue.playing) await queue.play();
    },
};