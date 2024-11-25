const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { warnPut, infoPut } = require('../../utils/utils');
const twitch = require('../../twitch/twitch');
const TwitchInfo = require('../../modules/Twitch');
const TwitchChannels = require('../../modules/TwitchChannel');
const { setTwitchInstance, getTwitchInstance } = require('../../twitch/instance');

module.exports = {
            
    command: new SlashCommandBuilder()
        .setName('twitchsetup')
        .setDescription("Permet de configurer le module Twitch")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options
                .setName("clientid")
                .setDescription("Client ID Twitch. Récupérable sur https://dev.twitch.tv")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName("clientsecret")
                .setDescription("Client Secret Twitch. Récupérable sur https://dev.twitch.tv")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName("twitchchannel")
                .setDescription("Choisir la chaîne Twitch à utiliser pour surveiller les lives")
                .setRequired(true))
        .addStringOption((options) =>
            options
                .setName("twitchlivestream")
                .setDescription("Choisir une chaîne à surveiller")
                .setRequired(true))
        .addChannelOption((options) =>
            options
                .setName("channelannounce")
                .setDescription("Salon pour les notifications Twitch")
                .setRequired(true)),

    async run(_, message) {
        const ServeurID = message.guild.id;

        const ClientID = message.options.getString('clientid');
        const ClientSecret = message.options.getString('clientsecret');
        const TwitchChannel = message.options.getString('twitchchannel');
        const TwitchLiveStream = message.options.getString('twitchlivestream');
        const ChannelAnnounce = message.options.getChannel('channelannounce');
        const TwitchInfos = await TwitchInfo.findOne({ where: { IDServeur: ServeurID } });
        const TwitchChannelInfos = await TwitchChannels.findOne({ where: { IDServeur: ServeurID,  Channel: TwitchLiveStream } });

        try {
            message.reply({ content: `Génération du token Twitch en cours...`, ephemeral: true });
            //récupérer le token dans la console
            let originalWrite = process.stdout.write;
            let output = '';
            process.stdout.write = (chunk, encoding, callback) => {
                output += chunk.toString();
                if (originalWrite) {
                    originalWrite.apply(process.stdout, arguments);
                }
            };

            // Function to wait for token generation
            const waitForToken = () => {
                return new Promise((resolve, reject) => {
                    const checkOutput = () => {
                        const tokenMatch = output.match(/\(Twitch->getToken\) New token created at .* \((\S+)\)/);
                        const extractedToken = tokenMatch ? tokenMatch[1] : null;
                        if (extractedToken) {
                            resolve(extractedToken);
                        } else {
                            setTimeout(checkOutput, 100); // Check again after 100ms
                        }
                    };
                    checkOutput();
                });
            };

            // Wait for token to be captured
            const extractedToken = await waitForToken();

            // Restore original stdout.write
            process.stdout.write = originalWrite;

            if (extractedToken) {
                if (!TwitchInfos) {
                    // Save TwitchBot instance or its configuration to the database if needed
                    await TwitchInfo.create({ IDServeur: ServeurID, Channel: TwitchChannel, ChannelAnnounce: ChannelAnnounce.id, ClientID: ClientID, ClientSecret: ClientSecret, Token: extractedToken, Valeur: true });
                    //infoPut('Token généré: ' + extractedToken);
                    await message.editReply('Token enregistré avec succès.');
                } else {
                    // Update the existing configuration
                    await TwitchInfo.update({ Channel: TwitchChannel, ChannelAnnounce: ChannelAnnounce.id, ClientID: ClientID, ClientSecret: ClientSecret, Token: extractedToken, Valeur: true }, { where: { IDServeur: ServeurID } });
                    //infoPut('Token généré: ' + extractedToken);
                    await message.editReply('Token mis à jour avec succès.');
                }
                if (!TwitchChannelInfos)
                    await TwitchChannels.create({ IDServeur: ServeurID, Channel: TwitchLiveStream });
                const listChannel = await TwitchChannels.findAll({ where: { IDServeur: ServeurID } });
                //infoPut(`Chaînes Twitch surveillées sur le serveur ${ServeurID}:\n\n${TwitchChannelArrays}`);
                // Update existing instance or create a new one if it doesn't exist
                let twitchInstance = getTwitchInstance();
                if (!twitchInstance) {
                    twitchInstance = new twitch(
                        [TwitchChannel], // channels
                        [], // liveChannels
                        {
                            id: ClientID,
                            secret: ClientSecret,
                            token: extractedToken // Use the new token
                        }
                    );
                    listChannel.forEach(info => {
                        if (!Array.from(twitchInstance.getChannels()).includes(info.Channel))
                            twitchInstance.addChannel(info.Channel);
                    });
                    setTwitchInstance(twitchInstance);
                    infoPut('TwitchBot instance created and updated for this server.');
                } else {
                    // Si le TwitchLiveChannel est déjà surveillé
                    if (!Array.from(twitchInstance.getChannels()).includes(TwitchLiveStream))
                        twitchInstance.addChannel(TwitchLiveStream);
                    twitchInstance.updateClient({
                        id: ClientID,
                        secret: ClientSecret,
                        token: extractedToken // Use the new token
                    });
                    infoPut('Twitch info updated for this server.');
                }
            } else {
                warnPut('Erreur: Impossible de récupérer le token généré.');
            }
        } catch (err) {
            warnPut("Erreur lors de la config TwitchSetup:\n\n" + err);
        }
    }
};


