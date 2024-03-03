const { PermissionFlagsBits, SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const Level = require("../../modules/xp");
const Msg = require("../../modules/Msg");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('rank')
        .setDescription("affiche ton rank ou le rank d'un autre membre")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addUserOption(option => option.setName("membre").setDescription("choix du membre").setRequired(false)),

    async run(client, message, args) {

        const serveurID = message.guild.id;
        const user = message.options.getUser("membre") ?? message.user
        const MembreID = user.id
        const search = await Level.findOne({ where: { IDMembre: MembreID, IDServeur: serveurID } });

        if (!search) {
            if (message.user.id === user.id) {

                message.reply({ content: `Tu n'a pas encore de rank !`, ephemeral: true });
                return;
            } else {

                message.reply({ content: `${user.username} n'a pas encore de rank !`, ephemeral: true });
                return;
            }
        }

        let TitleRank = `**Rank de ${user.username}**`

        const rankTitleConfig = await Msg.findOne({ where: { Infos: "RankTitle", IDServeur: serveurID } });
        const Title1 = rankTitleConfig.Part1;
        const Mention = rankTitleConfig.Mention;
        let Title2 = rankTitleConfig.Part2;
        if (Title2 === null) {
            Title2 = "";
        }
        let Title3 = rankTitleConfig.Part3;
        if (Title3 === null) {
            Title3 = "";
        }
        if (Title1 !== null) {
            if (Mention === true) {
                TitleRank = `${Title1} ${user.username} ${Title2} ${Title3}`;
            }
            else {
                TitleRank = `${Title1} ${Title2} ${Title3}`;
            }
        }

        const level = await search.get("level");
        const xp = await search.get("xp");

        const colors = ["#FDDFDF", "#F4EEB1", "#75ABBF", "#FF8080", "#CCA9DD", "#B0F2B6"];
        const randomColorNo = Math.floor(Math.random() * colors.length);
        const randomColor = colors[randomColorNo];

        const nextLVL = Math.floor(level * level * 50);

        const allLevels = await Level.findAll({ where: { IDServeur: serveurID } });
        const sortedLevels = allLevels.sort((a, b) => b.xp - a.xp);
        const rank = sortedLevels.findIndex((lvl) => lvl.IDMembre === user.id) + 1;

        let RankMsg = `${rank}ème au classement !`
        if (rank === 1) {
            RankMsg = `Top #${rank} du classement !`
        }

        let ranked = `${rank}ème`
        if (rank === 1) {
            ranked = `Top #${rank}`
        }

        const rankMsgConfig = await Msg.findOne({ where: { Infos: "Rank", IDServeur: serveurID } });
        const Msg1 = rankMsgConfig.Part1;
        let Msg2 = rankMsgConfig.Part2;
        if (Msg2 === null) {
            Msg2 = "";
        }
        let ShowRank = rankMsgConfig.Mention;
        let Msg3 = rankMsgConfig.Part3;
        if (Msg3 === null) {
            Msg3 = "";
        }
        if (Msg1 !== null) {
            if (ShowRank === true) {
                RankMsg = `${Msg1} ${ranked} ${Msg2} ${Msg3}`;
            }
            else {
                RankMsg = `${Msg1} ${Msg2} ${Msg3}`;
            }
        }

        const canvas = Canvas.createCanvas(1000, 300);
        const ctx = canvas.getContext('2d'),
            bar_width = 600,
            bg = await Canvas.loadImage('./img/background.jpg'),
            av = await Canvas.loadImage(user.displayAvatarURL({ extension: 'jpg', dynamic: false }));
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(120, 120, 110, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();

        ctx.lineJoin = "round";
        ctx.lineWidth = 69;

        ctx.strokeRect(298, 199, bar_width, 2);

        ctx.strokeStyle = randomColor
        ctx.strokeRect(300, 200, (bar_width * xp / nextLVL), 0);

        const applyText = (canvas, text) => {
            const context = canvas.getContext('2d');

            let fontSize = 40;

            do {
                context.font = `${fontSize -= 10}px impact`;
            } while (context.measureText(text).width > canvas.width - 300);

            return context.font;
        };
        
        ctx.font = applyText(canvas, user.username);
        ctx.fillStyle = randomColor;
        ctx.textAlign = "center";
        ctx.fillText(user.username, 120, 275, 200);

        ctx.fillText(`${level}`, 930, 40, 80);

        ctx.fillStyle = "lightgrey";
        ctx.font = "bold 25px impact";
        ctx.fillText(`Level :`, 850, 40, 200);

        ctx.fillStyle = randomColor;
        ctx.font = "bold 40px trebuchet-ms";
        ctx.fillText(RankMsg, 580, 80);

        ctx.fillStyle = "lightgrey";
        ctx.font = "bold 22px tahoma";
        ctx.fillText(`${xp}/${nextLVL} XP`, 850, 150);
        ctx.fillText(`${((xp * 100) / nextLVL).toFixed(0)}/100 %`, 350, 150);

        ctx.beginPath();
        ctx.arc(120, 120, 110, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(av, 10, 10, 220, 220);
        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'levelDisplay.png' });

        try {
            const welcomeEmbed = new EmbedBuilder()
                .setTitle(TitleRank)
                .setImage('attachment://levelDisplay.png')
                .setColor(randomColor)
                .setTimestamp();

            message.reply({ embeds: [welcomeEmbed], files: [attachment] });
        } catch (err) {

            message.reply({ content: "J'ai eu une erreur, recommence !", ephemeral: true })
        }
    }
}