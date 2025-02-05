const { Twitch } = require('@voidpkg/social-alert');
const { Khween } = require('../app.js');
const TwitchInfos = require('../modules/Twitch');
const TwitchChannel = require('../modules/TwitchChannel');
const { infoPut } = require('../utils/utils.js');

class twitch {
    constructor(channels = [], liveChannels = [], client = { id: '', secret: '', token: '' }, interval = 10000) {
        this.twitch = new Twitch({
            channels: channels,
            liveChannels: liveChannels,
            interval: interval,
            client: client
        });
    }

    addChannel(channel) {
        this.twitch.addChannel(channel);
    }

    removeChannel(channel) {
        this.twitch.removeChannel(channel);
    }

    updateChannels(channels) {
        this.twitch.channels = channels;
    }

    updateLiveChannels(liveChannels) {
        this.twitch.liveChannels = liveChannels;
    }

    updateClient(client) {
        this.twitch.client = client;
    }

    getLiveChannels() {
        return this.twitch.getLiveChannels();
    }

    getChannels() {
        return this.twitch.getChannels();
    }

    start() {
        this.onLive();
    }

    onLive() {
        this.twitch.on('live', async (stream) => {
            //infoPut(`[Twitch] ${stream.user_name} est en live sur ${stream.title}`);
            const streamer = stream.user_name.toString().toLowerCase();
            //infoPut(streamer);
            const TwitchChannelInfos = await TwitchChannel.findAll({ where: { Channel: streamer } });

            if (TwitchChannelInfos) {
                TwitchChannelInfos.forEach(async info => {
                    const ServeurID = info.get("IDServeur");
                    const ChannelAnnounceInfo = await TwitchInfos.findOne({ where: { IDServeur: ServeurID } });
                    const isEnabled = ChannelAnnounceInfo.get("Valeur");
                    if (isEnabled) {
                        const ChannelAnnounce = ChannelAnnounceInfo.get("ChannelAnnounce");
                        const Serveur = await Khween.client.guilds.fetch(ServeurID);
                        const Channel = await Serveur.channels.cache.get(ChannelAnnounce);
                        Channel.send(`@everyone\n🔴 ${stream.user_name} est en live sur https://twitch.tv/${streamer}`);
                    }
                });
            }
        });

        this.twitch.on('newToken', async ({ token, channel }) => {
            infoPut('Received new token for Twitch API.\n');
            const TwitchInfo = await TwitchInfos.findOne({ where: { Channel: channel } });
            if (TwitchInfo)
                await TwitchInfo.update({ Token: token });
        });
    }

    onOffline() {
        this.twitch.on('offline', (stream) => {
            //Who cares?
        });
    }

}

module.exports = twitch;