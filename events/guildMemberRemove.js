const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas")

module.exports = async (client, member) => {

    // TODO: v0.5.0
    // if (member.user.bot)

    //     return;
    
    // const welcomeChannel = member.guild.channels.cache.get('1040056381446832258')
    // const welcomeMessage = `<@${member.id}> était vraiment perdu.e ..`
    // const memberCount = member.guild.members.cache.filter(user => !user.user.bot).size;

    // const canvas = Canvas.createCanvas(700, 250);
    // const context = canvas.getContext('2d');

    // const background = await Canvas.loadImage('./img/background.jpg');
    // context.drawImage(background, 0, 0, canvas.width, canvas.height)

    // context.font = '80px impact';
    // context.fillStyle = '#987CC6';
    // context.fillText("Au revoir !", canvas.width / 2.5, canvas.height / 1.8);

    // context.beginPath();
    // context.arc(125, 125, 100, 0, Math.PI * 2, true);
    // context.closePath();
    // context.clip();

    // const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
    // context.drawImage(avatar, 25, 25, 200, 200);

    // const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profil-image.png' });

    // const welcomeEmbed = new EmbedBuilder()
    //     .setTitle("**EMERGENCY MEETING !**")
    //     .setDescription(welcomeMessage)
    //     .setImage('attachment://profil-image.png')
    //     .setFooter({ text: `Nous ne sommes plus que ${memberCount} énergumènes !` })
    //     .setColor("Purple")
    //     .setTimestamp();

    // welcomeChannel.send({ embeds: [welcomeEmbed], files: [attachment] });

    // const channelIdMembers = '1040322987582296104'

    // const updateMembers = guild => {
    //     const channel = guild.channels.cache.get(channelIdMembers)
    //     channel.setName(`👤Membres: ${guild.members.cache.filter(member => !member.user.bot).size}`)
    // }
    // updateMembers(member.guild)

    // const channelIdBots = '1040328920983162891'

    // const updateBots = guild => {
    //     const channel = guild.channels.cache.get(channelIdBots)
    //     channel.setName(`🤖Bots: ${guild.members.cache.filter(member => member.user.bot).size}`)
    // }

    // updateBots(member.guild)

    // const guild = client.guilds.cache.get('832635679079006228')
    // updateMembers(guild)
    // updateBots(guild)
    
    const Level = require('./xp');
    const MembreID = member.id;
    const search = await Level.findOne({ where: { IDMembre: MembreID } });
    if (!search)
        return;
    await Level.destroy({ where: { IDMembre: MembreID } });
};