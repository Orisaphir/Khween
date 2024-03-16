const { PermissionFlagsBits, SlashCommandBuilder, ActivityType } = require('discord.js');
const fs = require('fs');
const { Khween } = require('../../app.js');
const Ori = `<@421416465430741003>`;

module.exports = {

    command: new SlashCommandBuilder()
        .setName('activity')
        .setDescription("Permet de changer l'activité du bot")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options
                .setName("type")
                .setDescription("Type d'activité")
                .setRequired(true)
                .addChoices({ name: `Joue à`, value: 'PLAYING' }, { name: `Écoute`, value: 'LISTENING' }, { name: `Regarde`, value: 'WATCHING' }, { name: `Stream`, value: 'STREAMING' }, { name: `Participe`, value: 'COMPETING' }, { name: `Phrase de statut`, value: 'CUSTOM' })
        )
        .addStringOption((options) => options.setName("message").setDescription(`Message d'activité à afficher`).setRequired(true))
        .addStringOption((options) =>
            options
                .setName("statut")
                .setDescription("Statut du bot")
                .setRequired(false)
                .addChoices({ name: 'En ligne', value: 'online' }, { name: 'Absent', value: 'idle' }, { name: 'Ne pas déranger', value: 'dnd' }, { name: 'Invisible', value: 'invisible' })
        )
        .addStringOption((options) => options.setName("url").setDescription('URL du stream à afficher').setRequired(false)),

    async run(_, message) {
        if (message.user.id !== Khween.master_id) return message.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        const Type = message.options.getString('type');
        const Message = message.options.getString('message');
        let Status = "online";
        if (message.options.getString('statut')) {
            Status = message.options.getString('statut');
        }
        let StreamURL = null;
        if (message.options.getString('url') && Type === "STREAMING" && message.options.getString('url').startsWith('https://www.twitch.tv/')) {
            StreamURL = message.options.getString('url');
        }
        let config = require('../../config.json');

        try {
            if (Type === "PLAYING") {
                config.ACTIVITY_TYPE = "Playing";
                config.ACTIVITY_NAME = `${Message}`;
                config.ACTIVITY_STATUS = `${Status}`
                config.ACTIVITY_URL = `${StreamURL}`
                fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
                client.user.setPresence({ activities: [{ name: Message, type: ActivityType.Playing }] })
            }
            if (Type === "LISTENING") {
                config.ACTIVITY_TYPE = "Listening";
                config.ACTIVITY_NAME = `${Message}`;
                config.ACTIVITY_STATUS = `${Status}`
                config.ACTIVITY_URL = `${StreamURL}`
                fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
                client.user.setPresence({ activities: [{ name: Message, type: ActivityType.Listening }], status: Status })
            }
            if (Type === "WATCHING") {
                config.ACTIVITY_TYPE = "Watching";
                config.ACTIVITY_NAME = `${Message}`;
                config.ACTIVITY_STATUS = `${Status}`
                config.ACTIVITY_URL = `${StreamURL}`
                fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
                client.user.setPresence({ activities: [{ name: Message, type: ActivityType.Watching }], status: Status })
            }
            if (Type === "STREAMING") {
                config.ACTIVITY_TYPE = "Streaming";
                config.ACTIVITY_NAME = `${Message}`;
                config.ACTIVITY_STATUS = `${Status}`
                config.ACTIVITY_URL = `${StreamURL}`
                fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
                client.user.setPresence({ activities: [{ name: Message, type: ActivityType.Streaming, url: StreamURL }], status: Status })
            }
            if (Type === "COMPETING") {
                config.ACTIVITY_TYPE = "Competing";
                config.ACTIVITY_NAME = `${Message}`;
                config.ACTIVITY_STATUS = `${Status}`
                config.ACTIVITY_URL = `${StreamURL}`
                fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
                client.user.setPresence({ activities: [{ name: Message, type: ActivityType.Competing }], status: Status })
            }
            if (Type === "CUSTOM") {
                config.ACTIVITY_TYPE = "Custom";
                config.ACTIVITY_NAME = `${Message}`;
                config.ACTIVITY_STATUS = `${Status}`
                config.ACTIVITY_URL = `${StreamURL}`
                fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
                client.user.setPresence({ activities: [{ name: Message, type: ActivityType.Custom }], status: Status })
            }
            await message.reply({ content: "L'activité a bien été changée", ephemeral: true });
        } catch (err) {
            console.log(err);
            await message.reply({ content: `Une erreur est survenue lors du changement de l'activité. Merci de contacter ${Ori} au plus vite`, ephemeral: true });
        }
    }
}