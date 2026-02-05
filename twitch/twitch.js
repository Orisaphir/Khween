const { Twitch } = require('@voidpkg/social-alert');
const { Khween } = require('../app.js');
const TwitchInfos = require('../modules/Twitch');
const TwitchChannel = require('../modules/TwitchChannel');
const { infoPut, warnPut } = require('../utils/utils.js');

class twitch {
    constructor(channels = [], liveChannels = [], client = { id: '', secret: '', token: '' }, interval = 10000) {
        if (client && !client.channel && Array.isArray(channels) && channels.length > 0) {
            client.channel = channels[0];
        }
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
            if (!channel) {
                warnPut('[Twitch] Channel undefined dans newToken. Mise à jour du token pour le client Twitch actif uniquement.\n');
                try {
                    await TwitchInfos.update(
                        { Token: token },
                        { where: { ClientID: this.twitch.client.id, ClientSecret: this.twitch.client.secret } }
                    );
                } catch (e) {
                    warnPut('[Twitch] Erreur lors de la mise à jour du token Twitch dans la BDD: ' + e + '\n');
                }
                return;
            }
            await TwitchInfos.update(
                { Token: token },
                { where: { ClientID: this.twitch.client.id, ClientSecret: this.twitch.client.secret, Channel: channel } }
            );
        });
    }

    onOffline() {
        this.twitch.on('offline', (stream) => {
            //Who cares?
        });
    }

}

module.exports = twitch;