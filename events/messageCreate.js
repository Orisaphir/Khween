const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Ori = `421416465430741003`
const Level = require("../modules/xp")
const Admins = require("../modules/Admin")
const Msg = require("../modules/Msg")
const Infos = require("../modules/Infos")
const Reward = require("../modules/Reward")
const BLChannels = require("../modules/BlackListChannels")
const { Khween } = require("../app")

module.exports = async (client, message, member) => {

    const serveurID = message.guild.id;
    const isBL = await BLChannels.findOne({ where: { IDServeur: serveurID, Channel: message.channel.id } });

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    if (message.content.startsWith("%lock")) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return
        if (!message.guild.roles.everyone.permissionsIn(message.channel.id).has(PermissionFlagsBits.SendMessages)) return
        await message.channel.permissionOverwrites.set([
            {
                id: message.guild.roles.everyone,
                deny: [PermissionFlagsBits.SendMessages]
            }
        ])
        return message.channel.send("Salon verrouillé");
    }
    if (message.content.startsWith("%unlock")) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return
        if (message.guild.roles.everyone.permissionsIn(message.channel.id).has(PermissionFlagsBits.SendMessages)) return
        await message.channel.permissionOverwrites.set([
            {
                id: message.guild.roles.everyone,
                allow: [PermissionFlagsBits.SendMessages]
            }
        ])
        return message.channel.send("Salon déverrouillé");
    }

    const adminInfos = await Admins.findOne({ where: { Module: "xp" }, IDServeur: serveurID });
    if (adminInfos.Valeur === false) return;

    let orisaphir = null;
    try {
        orisaphir = await message.guild.members.fetch(Ori);
        orisaphir = orisaphir.user;
    }
    catch (err) {
        console.log(`Erreur lors de la récupération de Ori : ${err}`);
    }
    let levelUp = message.channel;
    try {
        const levelUpChannel = await Infos.findOne({ where: { Infos: "levelup" }, IDServeur: serveurID });
        if (levelUpChannel.DiscordID !== null)
            levelUp = await message.guild.channels.cache.get(levelUpChannel.DiscordID);
    }
    catch (err) {
        console.log(`Erreur lors de la récupération du channel de level up : ${err}`);
    }
    let NewRole = message.channel;
    try {
        const NewRoleChannel = await Msg.findOne({ where: { Infos: "NewRole" }, IDServeur: serveurID });
        if (NewRoleChannel.Niveau === true) {
            const LevelChannel = await Infos.findOne({ where: { Infos: "levelup", IDServeur: serveurID } });
            NewRole = await message.guild.channels.cache.get(LevelChannel.DiscordID);
        }
    }
    catch (err) {
        console.log(`Erreur lors de la récupération du channel de level up pour le NewRole : ${err}`);
    }

    const MembreID = message.author.id;
    const ServeurID = message.guild.id;
    const search = await Level.findOne({ where: { IDMembre: MembreID, IDServeur: serveurID } });
    let level = 0;
    let ge = 0;
    if (search) {
        level = await search.get("level");
        checkLevel(level)
    }

    if (!search) {
        if (isBL) return console.log(`Le salon ${message.channel.name} est bloqué pour l'XP !`);

        try {
            let champs = {
                IDMembre: MembreID,
                IDServeur: ServeurID,
                xp: 1,
                level: 1,
            }
            level = 1;
            let levelmsg = `Félicitation ${message.author.username} ! Tu viens de passer niveau 1 !`

            const levelmsgConfig = await Msg.findOne({ where: { Infos: "LevelUp", IDServeur: serveurID } });
            const Part1 = levelmsgConfig.Part1;
            const Mention = levelmsgConfig.Mention;
            let Part2 = levelmsgConfig.Part2;
            if (Part2 === null) {
                Part2 = "";
            }
            const Niveau = levelmsgConfig.Niveau;
            let Part3 = levelmsgConfig.Part3;
            if (Part3 === null) {
                Part3 = "";
            }
            if (Part1 !== null) {
                if (Mention === true) {
                    if (Niveau === true) {
                        levelmsg = `${Part1} ${message.author.username} ${Part2} ${level} ${Part3}`;
                    }
                    else {
                        levelmsg = `${Part1} ${message.author.username} ${Part2} ${Part3}`;
                    }
                }
                else {
                    if (Niveau === true) {
                        levelmsg = `${Part1} ${Part2} ${level} ${Part3}`;
                    }
                    else {
                        levelmsg = `${Part1} ${Part2} ${Part3}`;
                    }
                }
            }

            let rolemsg = `Tu as débloqué un nouveau rôle`

            const rolemsgConfig = await Msg.findOne({ where: { Infos: "NewRole", IDServeur: serveurID } });
            const Part1Role = rolemsgConfig.Part1;
            const MentionRole = rolemsgConfig.Mention;
            let Part2Role = rolemsgConfig.Part2;
            if (Part2Role === null) {
                Part2Role = "";
            }
            let Part3Role = rolemsgConfig.Part3;
            if (Part3Role === null) {
                Part3Role = "";
            }
            if (Part1Role !== null) {
                if (MentionRole === true) {
                    rolemsg = `${Part1Role} ${message.author.username} ${Part2Role} ${Part3Role}`;
                }
                else {
                    rolemsg = `${Part1Role} ${Part2Role} ${Part3Role}`;
                }
            }

            Level.create(champs);
            const isLevelUpSend = await Admins.findOne({ where: { Module: "levelup", IDServeur: serveurID } });
            if (isLevelUpSend.Valeur === true) {
                levelUp.send(levelmsg);
            }
            const reward = await Reward.findOne({ where: { IDServeur: ServeurID, Level: level, IDServeur: serveurID } });
            if (reward) {
                const role = message.guild.roles.cache.get(reward.IDRole);
                if (role) {
                    message.member.roles.add(role);
                    const isNewRoleSend = await Admins.findOne({ where: { Module: "NewRole", IDServeur: serveurID } });
                    if (isNewRoleSend.Valeur === true) {
                        NewRole.send(rolemsg);
                    }
                }
            }
        } catch (err) {
            try {
                adminInfos.update({ Valeur: false }, { where: { Module: "xp", IDServeur: serveurID } });
                if(orisaphir === null || orisaphir === undefined) {
                    return console.log(`Erreur : ${err}`);
                }
                const embed = new EmbedBuilder()
                    .setTitle('Erreur')
                    .setDescription(`Erreur lors de l'exécution du module level dans messageCreate.js\n\n\`\`\`js\n${err}\n\`\`\``)
                    .setColor('#FF0000')
                    .setTimestamp();
                orisaphir.createDM().then(channel => {
                    return channel.send({ embeds: [embed] });
                });
            } catch (errOri) {
                console.log(`Erreur lors de l'envoi de l'erreur à Ori : \n${errOri}\n\nErreur d'origine : \n${err}`);
            }
        };
    } else {
        if (isBL) return
        const lastUpdate = search.get("updatedAt");
        let date = "";
        let heure = "";
        if (typeof lastUpdate === "string") {
            date = lastUpdate.split(" ")[1] + " " + lastUpdate.split(" ")[2] + " " + lastUpdate.split(" ")[3];
            heure = lastUpdate.split(" ")[4];
        } else {
            date = String(lastUpdate).split(" ")[1] + " " + String(lastUpdate).split(" ")[2] + " " + String(lastUpdate).split(" ")[3];
            heure = String(lastUpdate).split(" ")[4];
        }
        let getCorrectDate = new Date(`${date} ${heure}`);
        let LastUpdateTimestamp = getCorrectDate.getTime();
        let TimestampNow = new Date().getTime();
        let diff = TimestampNow - LastUpdateTimestamp;
        let diffSecondes = diff / 1000;
        if (diffSecondes < Khween.cooldown) return;
        const newxp = ge
        const xplevel = level * level * 50
        let xp = await search.get("xp");
        const xpavant = Number(xp)
        let result = xpavant + newxp
        resultLevel = level + 1

        try {
            
            Level.update({ xp: result }, { where: { IDMembre: MembreID, IDServeur: serveurID } });
            xp = result

            if(xp >= xplevel){

                let levelmsg = `Félicitation ${message.author.username} ! Tu viens de passer niveau ${resultLevel} !`

                const levelmsgConfig = await Msg.findOne({ where: { Infos: "LevelUp", IDServeur: serveurID } });
                const Part1 = levelmsgConfig.Part1;
                const Mention = levelmsgConfig.Mention;
                let Part2 = levelmsgConfig.Part2;
                if (Part2 === null) {
                    Part2 = "";
                }
                const Niveau = levelmsgConfig.Niveau;
                let Part3 = levelmsgConfig.Part3;
                if (Part3 === null) {
                    Part3 = "";
                }
                if (Part1 !== null) {
                    if (Mention === true) {
                        if (Niveau === true) {
                            levelmsg = `${Part1} ${message.author.username} ${Part2} ${resultLevel} ${Part3}`;
                        }
                        else {
                            levelmsg = `${Part1} ${message.author.username} ${Part2} ${Part3}`;
                        }
                    }
                    else {
                        if (Niveau === true) {
                            levelmsg = `${Part1} ${Part2} ${resultLevel} ${Part3}`;
                        }
                        else {
                            levelmsg = `${Part1} ${Part2} ${Part3}`;
                        }
                    }
                }
            
                let rolemsg = `Tu as débloqué un nouveau rôle`

                const rolemsgConfig = await Msg.findOne({ where: { Infos: "NewRole", IDServeur: serveurID } });
                const Part1Role = rolemsgConfig.Part1;
                const MentionRole = rolemsgConfig.Mention;
                let Part2Role = rolemsgConfig.Part2;
                if (Part2Role === null) {
                    Part2Role = "";
                }
                let Part3Role = rolemsgConfig.Part3;
                if (Part3Role === null) {
                    Part3Role = "";
                }
                if (Part1Role !== null) {
                    if (MentionRole === true) {
                        rolemsg = `${Part1Role} ${message.author.username} ${Part2Role} ${Part3Role}`;
                    }
                    else {
                        rolemsg = `${Part1Role} ${Part2Role} ${Part3Role}`;
                    }
                }

                Level.update({ level: resultLevel }, { where: { IDMembre: MembreID, IDServeur: serveurID } });
                Level.update({ xp: 0 }, { where: { IDMembre: MembreID, IDServeur: serveurID } });
                levelUp.send(levelmsg)
                const reward = await Reward.findOne({ where: { IDServeur: ServeurID, Level: resultLevel, IDServeur: serveurID } });
                if (reward) {
                    const role = message.guild.roles.cache.get(reward.IDRole);
                    if (role) {
                        message.member.roles.add(role);
                        const isNewRoleSend = await Admins.findOne({ where: { Module: "NewRole", IDServeur: serveurID } });
                        if (isNewRoleSend.Valeur === true) {
                            NewRole.send(rolemsg);
                        }
                    }
                }
            }
        } catch (err) {
            try {
                adminInfos.update({ Valeur: false }, { where: { Module: "xp", IDServeur: serveurID } });
                if(orisaphir === null || orisaphir === undefined) {
                    return console.log(`Erreur : ${err}`);
                }
                const embed = new EmbedBuilder()
                    .setTitle('Erreur')
                    .setDescription(`Erreur lors de l'exécution du module level dans messageCreate.js\n\n\`\`\`js\n${err}\n\`\`\``)
                    .setColor('#FF0000')
                    .setTimestamp();
                orisaphir.createDM().then(channel => {
                    return channel.send({ embeds: [embed] });
                });
            } catch (errOri) {
                console.log(`Erreur lors de l'envoi de l'erreur à Ori : \n${errOri}\n\nErreur d'origine : \n${err}`);
            }
        };
    }
    async function checkLevel(level) {
        let ge = " ";
        if(level <= 5) {
            ge == await generateXp(10, 20);
        }
        if(level > 5 && level <= 10) {
            ge == await generateXp(25, 50);
        }
        if(level > 10 && level <= 20) {
            ge == await generateXp(50, 75);
        }
        if(level > 20 && level <= 30) {
            ge == await generateXp(100, 125);
        }
        if(level > 30 && level <= 40) {
            ge == await generateXp(200, 400);
        }
        if(level > 40 && level < 49) {
            ge == await generateXp(200, 300);
        }
        if(level == 49) {
            ge == await generateXp(10, 20);
        }
        if(level => 50 && level <= 60) {
            ge == await generateXp(1, 10);
        }
        if(level > 60 && level <= 70) {
            ge == await generateXp(1, 8);
        }
        if(level > 70 && level <= 80) {
            ge == await generateXp(1, 6);
        }
        if(level > 80 && level <= 90) {
            ge == await generateXp(1, 4);
        }
        if(level > 90 && level < 99) {
            ge == await generateXp(1, 2);
        }
        if(level == 99) {
            ge == await generateXp(0, 1);
        }
        if(level += 100) {
            ge == await generateXp(0, 0);
        }
    }

    async function generateXp(min, max) {
    ge = Math.floor(Math.random() * (max - min)) + min;
    return ge;
    }
}