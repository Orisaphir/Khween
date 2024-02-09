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
            { Module: 'verify', Valeur: false},
            { Module: 'logs', Valeur: false},
            { Module: 'WelcomeLeave', Valeur: false},
            { Module: 'stats', Valeur: false}
        ]);
    }
    await Admins.findOrCreate({ where: { Module: 'ticket' }, defaults: { Valeur: false } });
    await Admins.findOrCreate({ where: { Module: 'xp' }, defaults: { Valeur: false } });
    await Admins.findOrCreate({ where: { Module: 'verify' }, defaults: { Valeur: false } });
    await Admins.findOrCreate({ where: { Module: 'logs' }, defaults: { Valeur: false } });
    await Admins.findOrCreate({ where: { Module: 'WelcomeLeave' }, defaults: { Valeur: false } });
    await Admins.findOrCreate({ where: { Module: 'stats' }, defaults: { Valeur: false } });
    

    const Infos = require("../modules/Infos")
    await Infos.sync()
    const count2 = await Infos.count();
    if (count2 === 0) {
        await Infos.bulkCreate([
            { Infos: 'openticket', Valeur: false },
            { Infos: 'ticketchannel', Valeur: false },
            { Infos: 'archiveticket', Valeur: false },
            { Infos: 'verifychannel', Valeur: false },
            { Infos: 'verifyrole', Valeur: false },
            { Infos: 'logs', Valeur: false},
            { Infos: 'WelcomeLeave', Valeur: false},
            { Infos: 'statsmembers', Valeur: false},
            { Infos: 'statsbots', Valeur: false},
            { Infos: 'levelup', Valeur: false}
        ]);
    }
    await Infos.findOrCreate({ where: { Infos: 'openticket' }, defaults: { Valeur: false } });
    await Infos.findOrCreate({ where: { Infos: 'ticketchannel' }, defaults: { Valeur: false } });
    await Infos.findOrCreate({ where: { Infos: 'archiveticket' }, defaults: { Valeur: false } });
    await Infos.findOrCreate({ where: { Infos: 'verifychannel' }, defaults: { Valeur: false } });
    await Infos.findOrCreate({ where: { Infos: 'verifyrole' }, defaults: { Valeur: false } });
    await Infos.findOrCreate({ where: { Infos: 'logs' }, defaults: { Valeur: false } });
    await Infos.findOrCreate({ where: { Infos: 'WelcomeLeave' }, defaults: { Valeur: false } });
    await Infos.findOrCreate({ where: { Infos: 'statsmembers' }, defaults: { Valeur: false } });
    await Infos.findOrCreate({ where: { Infos: 'statsbots' }, defaults: { Valeur: false } });
    await Infos.findOrCreate({ where: { Infos: 'levelup' }, defaults: { Valeur: false } });
    
    const Msg = require("../modules/Msg")
    await Msg.sync()
    const count3 = await Msg.count();
    if (count3 === 0) {
        await Msg.bulkCreate([
            { Infos: 'Welcome' },
            { Infos: 'WelcomeTitle' },
            { Infos: 'WelcomeFooter' },
            { Infos: 'Leave' },
            { Infos: 'LeaveTitle' },
            { Infos: 'LeaveFooter' },
            { Infos: 'Ticket'},
            { Infos: 'Verify' },
            { Infos: 'LevelUp' }
        ]);
    }
    await Msg.findOrCreate({ where: { Infos: 'Welcome' } });
    await Msg.findOrCreate({ where: { Infos: 'WelcomeTitle' } });
    await Msg.findOrCreate({ where: { Infos: 'WelcomeFooter' } });
    await Msg.findOrCreate({ where: { Infos: 'Leave' } });
    await Msg.findOrCreate({ where: { Infos: 'LeaveTitle' } });
    await Msg.findOrCreate({ where: { Infos: 'LeaveFooter' } });
    await Msg.findOrCreate({ where: { Infos: 'Ticket' } });
    await Msg.findOrCreate({ where: { Infos: 'Verify' } });
    await Msg.findOrCreate({ where: { Infos: 'LevelUp' } });

    const HistoData = require("../modules/HistoData")
    await HistoData.sync();
    const count4 = await HistoData.count();
    if (count4 === 0) {
        await HistoData.bulkCreate([
            { Infos: 'Ticket' },
            { Infos: 'Verify' },
        ]);
    }
    await HistoData.findOrCreate({ where: { Infos: 'Ticket' } });
    await HistoData.findOrCreate({ where: { Infos: 'Verify' } });

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

    console.log('Khween est prête !');
    client.user.setActivity('modérer')
}