const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const Msg = require('../../modules/Msg');
const Ori = `<@421416465430741003>`;

module.exports = {

    command: new SlashCommandBuilder()
        .setName('msgconfig')
        .setDescription("Permet de configurer les messages des différentes commandes")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options
                .setName("type")
                .setDescription("Type de message")
                .setRequired(true)
                .addChoices({ name: `Message d'arrivé Serveur`, value: 'welcome' }, { name: `Titre du message d'arrivé Serveur`, value: 'welcomeTitle' }, { name: `Footer du message d'arrivé Serveur`, value: 'welcomeFooter' }, { name: `Message de départ Serveur`, value: 'leave' }, { name: `Titre du message de départ Serveur`, value: 'leaveTitle' }, { name: `Footer du message de départ Serveur`, value: 'leaveFooter' }, { name: `Message du support Ticket`, value: 'ticket' }, { name: `Message de vérification`, value: 'verify' }, { name: `Message de passage de niveau`, value: 'levelup' }, { name: `Titre du message du rank`, value: 'ranktitle'}, { name: `Message de rank`, value: 'rank' }, { name: `Message du nouveau rôle`, value: 'newrole' })
        )
        .addStringOption((options) => options.setName("part1").setDescription('Message ou première partie du message à envoyer').setRequired(true))
        .addIntegerOption((options) =>
            options
                .setName("mention")
                .setDescription("Mentionner l'utilisateur ? / Afficher le nombre de membres ? / Afficher le rank ?")
                .setRequired(true)
                .addChoices({ name: 'Oui', value: 1 }, { name: 'Non', value: 0 })
        )
        .addStringOption((options) => options.setName("part2").setDescription('Deuxième partie du message à envoyer').setRequired(false))
        .addIntegerOption((options) =>
            options
                .setName("niveau")
                .setDescription("Afficher le niveau (seulement pour le message du levelup) ? / New Role dans le channel de niveau ?")
                .setRequired(false)
                .addChoices({ name: 'Oui', value: 1 }, { name: 'Non', value: 0 })
        )
        .addStringOption((options) => options.setName("part3").setDescription('Troisième partie du message à envoyer').setRequired(false)),

    async run(_, message) {
        const ServeurID = message.guild.id;

        await Msg.findOne({ where: { IDServeur: null } }).then(async (data) => {
            if (data) {
                await Msg.update({ IDServeur: ServeurID }, { where: { IDServeur: null } });
            }
        });

        const Type = message.options.getString('type');
        const Part1 = message.options.getString('part1');
        const Mention = message.options.getInteger('mention');
        let Part2 = null;
        if (message.options.getString('part2')) {
            Part2 = message.options.getString('part2');
        }
        if (Part1.length > 2000) return message.reply({ content: "Le message partie 1 est trop long !", ephemeral: true });
        if (Part2 !== null && Part2.length > 2000) return message.reply({ content: "Le message partie 2 est trop long !", ephemeral: true });
        let MentionValue = false;
        if (Mention === 1) {
            MentionValue = true;
        }
        let LevelValue = false;
        if (message.options.getInteger('niveau')) {
            if (message.options.getInteger('niveau') === 1) {
                LevelValue = true;
            }
        }
        let Part3 = null;
        if (message.options.getString('part3')) {
            Part3 = message.options.getString('part3');
        }
        if (Part3 !== null && Part3.length > 2000) return message.reply({ content: "Le message partie 3 est trop long !", ephemeral: true });
        try {
            if (Type === "welcome") {
                await Msg.findOne({ where: { IDServeur: ServeurID, Infos: "Welcome" } }).then(async (data) => {
                    if (!data) {
                        await Msg.create({ IDServeur: ServeurID, Infos: "Welcome" });
                    }
                });
                await Msg.update({ Part1: Part1, Mention: MentionValue, Part2: Part2 }, { where: { Infos: "Welcome", IDServeur: ServeurID } });
            }
            if (Type === "welcomeTitle") {
                await Msg.findOne({ where: { IDServeur: ServeurID, Infos: "WelcomeTitle" } }).then(async (data) => {
                    if (!data) {
                        await Msg.create({ IDServeur: ServeurID, Infos: "WelcomeTitle" });
                    }
                });
                await Msg.update({ Part1: Part1, Mention: MentionValue, Part2: Part2 }, { where: { Infos: "WelcomeTitle", IDServeur: ServeurID } });
            }
            if (Type === "welcomeFooter") {
                await Msg.findOne({ where: { IDServeur: ServeurID, Infos: "WelcomeFooter" } }).then(async (data) => {
                    if (!data) {
                        await Msg.create({ IDServeur: ServeurID, Infos: "WelcomeFooter" });
                    }
                });
                await Msg.update({ Part1: Part1, Mention: MentionValue, Part2: Part2 }, { where: { Infos: "WelcomeFooter", IDServeur: ServeurID } });
            }
            if (Type === "leave") {
                await Msg.findOne({ where: { IDServeur: ServeurID, Infos: "Leave" } }).then(async (data) => {
                    if (!data) {
                        await Msg.create({ IDServeur: ServeurID, Infos: "Leave" });
                    }
                });
                await Msg.update({ Part1: Part1, Mention: MentionValue, Part2: Part2 }, { where: { Infos: "Leave", IDServeur: ServeurID } });
            }
            if (Type === "leaveTitle") {
                await Msg.findOne({ where: { IDServeur: ServeurID, Infos: "LeaveTitle" } }).then(async (data) => {
                    if (!data) {
                        await Msg.create({ IDServeur: ServeurID, Infos: "LeaveTitle" });
                    }
                });
                await Msg.update({ Part1: Part1, Mention: MentionValue, Part2: Part2 }, { where: { Infos: "LeaveTitle", IDServeur: ServeurID } });
            }
            if (Type === "leaveFooter") {
                await Msg.findOne({ where: { IDServeur: ServeurID, Infos: "LeaveFooter" } }).then(async (data) => {
                    if (!data) {
                        await Msg.create({ IDServeur: ServeurID, Infos: "LeaveFooter" });
                    }
                });
                await Msg.update({ Part1: Part1, Mention: MentionValue, Part2: Part2 }, { where: { Infos: "LeaveFooter", IDServeur: ServeurID } });
            }
            if (Type === "ticket") {
                await Msg.findOne({ where: { IDServeur: ServeurID, Infos: "Ticket" } }).then(async (data) => {
                    if (!data) {
                        await Msg.create({ IDServeur: ServeurID, Infos: "Ticket" });
                    }
                });
                await Msg.update({ Part1: Part1, Mention: MentionValue, Part2: Part2 }, { where: { Infos: "Ticket", IDServeur: ServeurID } });
            }
            if (Type === "verify") {
                await Msg.findOne({ where: { IDServeur: ServeurID, Infos: "Verify" } }).then(async (data) => {
                    if (!data) {
                        await Msg.create({ IDServeur: ServeurID, Infos: "Verify" });
                    }
                });
                await Msg.update({ Part1: Part1, Mention: MentionValue, Part2: Part2 }, { where: { Infos: "Verify", IDServeur: ServeurID } });
            }
            if (Type === "levelup") {
                await Msg.findOne({ where: { IDServeur: ServeurID, Infos: "LevelUp" } }).then(async (data) => {
                    if (!data) {
                        await Msg.create({ IDServeur: ServeurID, Infos: "LevelUp" });
                    }
                });
                await Msg.update({ Part1: Part1, Mention: MentionValue, Part2: Part2, Niveau: LevelValue, Part3: Part3 }, { where: { Infos: "LevelUp", IDServeur: ServeurID } });
            }
            if (Type === 'ranktitle') {
                await Msg.findOne({ where: { IDServeur: ServeurID, Infos: "RankTitle" } }).then(async (data) => {
                    if (!data) {
                        await Msg.create({ IDServeur: ServeurID, Infos: "RankTitle" });
                    }
                });
                await Msg.update({ Part1: Part1, Mention: MentionValue, Part2: Part2, Niveau: LevelValue, Part3: Part3 }, { where: { Infos: "RankTitle", IDServeur: ServeurID } });
            }
            if (Type === 'rank') {
                await Msg.findOne({ where: { IDServeur: ServeurID, Infos: "Rank" } }).then(async (data) => {
                    if (!data) {
                        await Msg.create({ IDServeur: ServeurID, Infos: "Rank" });
                    }
                });
                await Msg.update({ Part1: Part1, Mention: MentionValue, Part2: Part2, Niveau: LevelValue, Part3: Part3 }, { where: { Infos: "Rank", IDServeur: ServeurID } });
            }
            await message.reply({ content: "La configuration a bien été enregistrée. Merci de faire un /configedit pour appliquer les changements sur les différents messages.", ephemeral: true });
        } catch (err) {
            message.reply({ content: `Une erreur est survenue. Merci de contacter ${Ori} au plus vite`, ephemeral: true });
            console.log(err);
        }
    }
};