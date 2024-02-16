const { EmbedBuilder } = require('discord.js');
const Ori = `421416465430741003`
const Level = require("../modules/xp")
const Admins = require("../modules/Admin")
const Msg = require("../modules/Msg")
const Infos = require("../modules/Infos")
const Reward = require("../modules/Reward")

module.exports = async (client, message, member) => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    const adminInfos = await Admins.findOne({ where: { Module: "xp" } });
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
        const levelUpChannel = await Infos.findOne({ where: { Infos: "levelup" } });
        if (levelUpChannel.DiscordID !== null)
            levelUp = await message.guild.channels.cache.get(levelUpChannel.DiscordID);
    }
    catch (err) {
        console.log(`Erreur lors de la récupération du channel de level up : ${err}`);
    }
    let NewRole = message.channel;
    try {
        const NewRoleChannel = await Msg.findOne({ where: { Infos: "NewRole" } });
        if (NewRoleChannel.Niveau === true) {
            const LevelChannel = await Infos.findOne({ where: { Infos: "levelup" } });
            NewRole = await message.guild.channels.cache.get(LevelChannel.DiscordID);
        }
    }
    catch (err) {
        console.log(`Erreur lors de la récupération du channel de level up pour le NewRole : ${err}`);
    }

    const MembreID = message.author.id;
    const ServeurID = message.guild.id;
    const search = await Level.findOne({ where: { IDMembre: MembreID } });
    let level = 0;
    let ge = 0;
    if (search) {
        level = await search.get("level");
        checkLevel(level)
    }

    if (!search) {

        try {
            let champs = {
                IDMembre: MembreID,
                IDServeur: ServeurID,
                xp: 1,
                level: 1,
            }
            level = 1;
            let levelmsg = `Félicitation ${message.author.username} ! Tu viens de passer niveau 1 !`

            const levelmsgConfig = await Msg.findOne({ where: { Infos: "LevelUp" } });
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

            const rolemsgConfig = await Msg.findOne({ where: { Infos: "NewRole" } });
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
            const isLevelUpSend = await Admins.findOne({ where: { Module: "levelup" } });
            if (isLevelUpSend.Valeur === true) {
                levelUp.send(levelmsg);
            }
            const reward = await Reward.findOne({ where: { IDServeur: ServeurID, Level: level } });
            if (reward) {
                const role = message.guild.roles.cache.get(reward.IDRole);
                if (role) {
                    message.member.roles.add(role);
                    const isNewRoleSend = await Admins.findOne({ where: { Module: "NewRole" } });
                    if (isNewRoleSend.Valeur === true) {
                        NewRole.send(rolemsg);
                    }
                }
            }
        } catch (err) {
            try {
                adminInfos.update({ Valeur: false }, { where: { Module: "xp" } });
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
        const newxp = ge
        const xplevel = level * level * 50
        let xp = await search.get("xp");
        const xpavant = Number(xp)
        let result = xpavant + newxp
        resultLevel = level + 1

        try {
            
            Level.update({ xp: result }, { where: { IDMembre: MembreID} });
            xp = result

            if(xp >= xplevel){

                let levelmsg = `Félicitation ${message.author.username} ! Tu viens de passer niveau ${resultLevel} !`

                const levelmsgConfig = await Msg.findOne({ where: { Infos: "LevelUp" } });
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

                const rolemsgConfig = await Msg.findOne({ where: { Infos: "NewRole" } });
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

                Level.update({ level: resultLevel }, { where: { IDMembre: MembreID} });
                Level.update({ xp: 0 }, { where: { IDMembre: MembreID} });
                levelUp.send(levelmsg)
                const reward = await Reward.findOne({ where: { IDServeur: ServeurID, Level: resultLevel } });
                if (reward) {
                    const role = message.guild.roles.cache.get(reward.IDRole);
                    if (role) {
                        message.member.roles.add(role);
                        const isNewRoleSend = await Admins.findOne({ where: { Module: "NewRole" } });
                        if (isNewRoleSend.Valeur === true) {
                            NewRole.send(rolemsg);
                        }
                    }
                }
            }
        } catch (err) {
            try {
                adminInfos.update({ Valeur: false }, { where: { Module: "xp" } });
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