const loadSlashCommands = require("../loaders/loadSlash")

module.exports = async client => {

    await loadSlashCommands(client)

    const Emojis = require("../modules/Emojis");
    await Emojis.sync();

    const Level = require("../modules/xp")
    await Level.sync()

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

    console.log('Ready!');
    client.user.setActivity('modérer')
}