const loadSlashCommands = require("../loaders/loadSlash")

module.exports = async client => {

    await loadSlashCommands(client)

    const Emojis = require("../modules/Emojis");
    await Emojis.sync();

    const Level = require("../modules/xp")
    await Level.sync();
    
    const Admins = require("../modules/Admin")
    await Admins.sync();
    const count = await Admins.count();
    if (count === 0) {
        await Admins.bulkCreate([
            { Module: 'ticket', Valeur: false },
            { Module: 'xp', Valeur: false },
            { Module: 'verify', Valeur: false} 
        ]);
    }

    const Infos = require("../modules/Infos")
    await Infos.sync()
    const count2 = await Infos.count();
    if (count2 === 0) {
        await Infos.bulkCreate([
            { Infos: 'openticket', Valeur: false },
            { Infos: 'ticketchannel', Valeur: false },
            { Infos: 'archiveticket', Valeur: false },
            { Infos: 'verifychannel', Valeur: false },
            { Infos: 'verifyrole', Valeur: false }
        ]);
    }

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