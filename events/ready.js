const loadSlashCommands = require("../loaders/loadSlash")
const { ActivityType } = require("discord.js")
const { Khween } = require("../app.js")
const { progress, put, infoPut, greenPut } = require("../utils/utils.js")
const { searchMaster } = require("../index.js")

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
            { Module: 'MessageLogs', Valeur: false},
            { Module: 'VocLogs', Valeur: false},
            { Module: 'WelcomeLeave', Valeur: false},
            { Module: 'stats', Valeur: false},
            { Module: 'levelup', Valeur: false},
            { Module: 'NewRole', Valeur: false}
        ]);
    }
    const AdminArray = [
        'ticket',
        'xp',
        'verify',
        'MessageLogs',
        'VocLogs',
        'WelcomeLeave',
        'stats',
        'levelup',
        'NewRole'
    ];

    for (let admin of AdminArray) {
        await Admins.findOrCreate({ where: { Module: admin }, defaults: { Valeur: false } });
    }
    

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
            { Infos: 'MessageLogs', Valeur: false},
            { Infos: 'VocLogs', Valeur: false},
            { Infos: 'WelcomeLeave', Valeur: false},
            { Infos: 'statsmembers', Valeur: false},
            { Infos: 'statsbots', Valeur: false},
            { Infos: 'levelup', Valeur: false}
        ]);
    }
    const infosArray = [
        'openticket',
        'ticketchannel',
        'archiveticket',
        'verifychannel',
        'verifyrole',
        'MessageLogs',
        'VocLogs',
        'WelcomeLeave',
        'statsmembers',
        'statsbots',
        'levelup'
    ];

    for (let info of infosArray) {
        await Infos.findOrCreate({ where: { Infos: info }, defaults: { Valeur: false } });
    }
    
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
    const msgArray = [
        'Welcome',
        'WelcomeTitle',
        'WelcomeFooter',
        'Leave',
        'LeaveTitle',
        'LeaveFooter',
        'Ticket',
        'Verify',
        'LevelUp',
        'RankTitle',
        'Rank',
        'NewRole'
    ];

    for (let msg of msgArray) {
        await Msg.findOrCreate({ where: { Infos: msg } });
    }

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
    
    const HistoDataArray = [
        'Ticket',
        'Verify',
        'Activity'
    ];

    for (let histo of HistoDataArray) {
        await HistoData.findOrCreate({ where: { Infos: histo } });
    }

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

    const twitch = require("../modules/Twitch")
    await twitch.sync();

    const twitchchannels = require("../modules/TwitchChannel")
    await twitchchannels.sync();

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

    const { setTwitchInstance } = require('../twitch/instance');
    const TwitchInfos = await twitch.findOne({ where: { Valeur: true } });
    const TwitchChannelInfo = await twitchchannels.findAll();

    if (TwitchInfos) {
        const Twitch = require("../twitch/twitch")
        const twitchBot = new Twitch(
            [TwitchInfos.get("Channel")],
            [],
            {
                id: TwitchInfos.get("ClientID"),
                secret: TwitchInfos.get("ClientSecret"),
                token: TwitchInfos.get("Token")
            }
        );
        if (TwitchChannelInfo) {
            TwitchChannelInfo.forEach(info => {
                if (!Array.from(twitchBot.getChannels()).includes(info.Channel))
                    twitchBot.addChannel(info.Channel);
            });
        }
        setTwitchInstance(twitchBot);
    }
}