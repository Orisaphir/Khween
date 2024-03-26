const loadSlashCommands = require("../loaders/loadSlash")
const { ActivityType } = require("discord.js")
const { Khween } = require("../app.js")
const { progress, searchMaster, put, infoPut, greenPut } = require("../index.js")

module.exports = async client => {

    await loadSlashCommands(client)

    infoPut(`\nChargement et vérification des bases de données...`);

    const Emojis = require("../modules/Emojis");
    await Emojis.sync();

    const Level = require("../modules/xp")
    await Level.sync();
    
    const Cooldown = require("../modules/Cooldown")
    await Cooldown.sync();
    progress(0.1)
    const Admins = require("../modules/Admin")
    await Admins.sync({ alter: true });
    progress(0.25)
    const count = await Admins.count();
    if (count === 0) {
        await Admins.bulkCreate([
            { Module: 'ticket', Valeur: false },
            { Module: 'xp', Valeur: false },
            { Module: 'verify', Valeur: false},
            { Module: 'logs', Valeur: false},
            { Module: 'WelcomeLeave', Valeur: false},
            { Module: 'stats', Valeur: false},
            { Module: 'levelup', Valeur: false},
            { Module: 'NewRole', Valeur: false}
        ]);
    }
    await Admins.findOrCreate({ where: { Module: 'ticket' }, defaults: { Valeur: false } });
    await Admins.findOrCreate({ where: { Module: 'xp' }, defaults: { Valeur: false } });
    await Admins.findOrCreate({ where: { Module: 'verify' }, defaults: { Valeur: false } });
    await Admins.findOrCreate({ where: { Module: 'logs' }, defaults: { Valeur: false } });
    await Admins.findOrCreate({ where: { Module: 'WelcomeLeave' }, defaults: { Valeur: false } });
    await Admins.findOrCreate({ where: { Module: 'stats' }, defaults: { Valeur: false } });
    await Admins.findOrCreate({ where: { Module: 'levelup' }, defaults: { Valeur: true } });
    await Admins.findOrCreate({ where: { Module: 'NewRole' }, defaults: { Valeur: true } });
    

    const Infos = require("../modules/Infos")
    await Infos.sync({ alter: true })
    progress(0.5)
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
    await Msg.sync({ alter: true })
    progress(0.75)
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
            { Infos: 'LevelUp' },
            { Infos: 'RankTitle'},
            { Infos: 'Rank'},
            { Infos: 'NewRole'}

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
    await Msg.findOrCreate({ where: { Infos: 'RankTitle' } });
    await Msg.findOrCreate({ where: { Infos: 'Rank' } });
    await Msg.findOrCreate({ where: { Infos: 'NewRole' } });

    const HistoData = require("../modules/HistoData")
    await HistoData.sync({ alter: true });
    progress(0.9)
    const count4 = await HistoData.count();
    if (count4 === 0) {
        await HistoData.bulkCreate([
            { Infos: 'Ticket' },
            { Infos: 'Verify' },
            { Infos: 'Activity' }
        ]);
    }
    await HistoData.findOrCreate({ where: { Infos: 'Ticket' } });
    await HistoData.findOrCreate({ where: { Infos: 'Verify' } });
    await HistoData.findOrCreate({ where: { Infos: 'Activity' } });

    const reactions = await Emojis.findAll();

    reactions.forEach(async data => {
            const IDServeur = data.get("IDServeur");
            const IDChannel = data.get("IDChannel");
            const IDMessage = data.get("IDMessage");
            try {
                const guild = await client.guilds.fetch(IDServeur);
                const channel = await guild.channels.cache.get(IDChannel);
                const message = await channel.messages.fetch(IDMessage);
            } catch (error) {
                await Emojis.destroy({ where: { IDServeur: IDServeur, IDChannel: IDChannel, IDMessage: IDMessage } });
            }
        }
    );

    const Reward = require("../modules/Reward")
    await Reward.sync();

    const BLChannels = require("../modules/BlackListChannels")
    await BLChannels.sync();

    const Starboard = require("../modules/Starboard")
    await Starboard.sync();

    const Starboardconfig = require("../modules/Starboardconfig")
    await Starboardconfig.sync();

    const StarboardHisto = require("../modules/StarboardHisto")
    await StarboardHisto.sync();

    const StarboardFiltre = require("../modules/StarboardFiltre")
    await StarboardFiltre.sync();

    const reaction2 = await StarboardHisto.findAll();

    reaction2.forEach(async data => {
            const IDServeur = data.get("IDServeur");
            const IDChannel = data.get("Channel");
            const IDMessage = data.get("Message");
            try {
                const guild = await client.guilds.fetch(IDServeur);
                const channel = await guild.channels.cache.get(IDChannel);
                const message = await channel.messages.fetch(IDMessage);
            } catch (error) {
                await StarboardHisto.destroy({ where: { IDServeur: IDServeur, Channel: IDChannel, Message: IDMessage } });
            }
            
        }
    );


    progress(1)
    greenPut(`\nBases de données chargées et vérifiées !\n\n`);
    infoPut('\nRecherche du propriétaire du bot...\n');
    await searchMaster();

    put('Khween est prête !');

    let activityType = ""
    let activity_url = null;

    if (Khween.activity_type === "Playing") {
        activityType = ActivityType.Playing;
    }
    if (Khween.activity_type === "Listening") {
        activityType = ActivityType.Listening;
    }
    if (Khween.activity_type === "Watching") {
        activityType = ActivityType.Watching;
    }
    if (Khween.activity_type === "Streaming") {
        activityType = ActivityType.Streaming;
        if (Khween.activity_url !== "" && Khween.activity_url !== null && Khween.activity_url.startsWith("https://www.twitch.tv/")) {
            activity_url = Khween.activity_url;
        }
    }
    if (Khween.activity_type === "Competing") {
        activityType = ActivityType.Competing;
    }
    if (Khween.activity_type === "Custom") {
        activityType = ActivityType.Custom;
    }

    client.user.setPresence({ activities: [{ name: Khween.activity_name, type: activityType, url: activity_url }], status: Khween.activity_status })
}