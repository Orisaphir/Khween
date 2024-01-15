const loadSlashCommands = require("../loaders/loadSlash")

module.exports = async client => {

    await loadSlashCommands(client)

    const Emojis = require("../modules/Emojis");
    await Emojis.sync();

    const Level = require("../modules/xp")
    await Level.sync()

    const Ticket = require("../modules/Ticket")
    await Ticket.sync()

    const reactions = await Emojis.findAll();

    reactions.forEach(async data => {
            const IDServeur = data.get("IDServeur");
            const IDChannel = data.get("IDChannel");
            const IDMessage = data.get("IDMessage");

            const guild = await client.guilds.fetch(IDServeur);
            const channel = await guild.channels.cache.get(IDChannel);
            const message = await channel.messages.fetch(IDMessage);
        }
    );

    const tickets = await Ticket.findAll();

    tickets.forEach(async data => {
            const IDServeur = data.get("IDServeur");
            const IDChannel = data.get("IDChannel");
            const IDMember = data.get("IDMember");

            const guild = await client.guilds.fetch(IDServeur);
            const channel = await guild.channels.cache.get(IDChannel);
            const member = await guild.members.cache.get(IDMember);

            const embed = new MessageEmbed()
                .setTitle("Ticket de " + member.user.username)
                .setDescription("Besoin de support (autre)")
                .setColor("#ff0000")
                .setFooter("Ticket ouvert");

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('close')
                        .setLabel('Fermer le ticket')
                        .setStyle('DANGER')
                        .setEmoji('🔒'),
                );

            const message = await channel.send({
                embeds: [embed],
                components: [row]
            });
    });

    console.log('Ready!');
    client.user.setActivity('modérer')
}