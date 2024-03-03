const { PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle, time, User } = require("discord.js");
const Reward = require("../../modules/Reward");
const reward = require("./reward");
let RewardInfo = [];

module.exports = {

    command: new SlashCommandBuilder()
        .setName('seereward')
        .setDescription("affiche les rewards actuels du serveur")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addIntegerOption((options) =>
            options
                .setName("publique")
                .setDescription("Rendre le message publique ?")
                .setRequired(false)
                .addChoices({ name: 'Oui', value: 1 }, { name: 'Non', value: 0 })
        ),

    async run(client, message, args) {
        
        let timestamp = Date.now();
        let eph = true;
        if (message.options.getInteger('publique') === 1) {
            eph = false;
        }

        if (RewardInfo.length > 0) {
            for (const info of RewardInfo) {
                if (timestamp - info.time > 30000) {
                    RewardInfo = RewardInfo.filter(info => info.IDMembre !== message.member.id && info.serveurID !== message.guild.id);
                }
            }
        }

        if (RewardInfo.find(info => info.IDMembre === message.member.id && info.serveurID === message.guild.id && info.isRunning === true)) {
            message.reply({ content: "Vous avez déjà un tableau de Reward en cours d'affichage !", ephemeral: true });
            return;
        } else {
            RewardInfo.push({
                IDMembre: message.member.id,
                serveurID: message.guild.id,
                isRunning: true,
                time: timestamp
            })
        }

        const serveurID = message.guild.id;
        const search = await Reward.findAll({ where: { IDServeur: serveurID } });
        if (!search) {
            message.reply({ content: `Il n'y a pas de rewards sur ce serveur !`, ephemeral: true });
            return;
        }

        let maxPages = Math.ceil(search.length / 10);

        let reward = `**Rewards actuels du serveur**\n\n`;
        let i = 1;
        for (const result of search.slice(0, 10)) {
            const role = message.guild.roles.cache.get(result.IDRole);
            reward += `${i}. Rôle : ${role} - Niveau : ${result.level}\n`;
            i++;
        }
        const embed = new EmbedBuilder()
            .setTitle(message.guild.name)
            .setDescription(reward)
            .setColor("#007FFF")
            .setFooter({ text: `Page 1/${maxPages}` });

        const button2 = new ButtonBuilder()
            .setLabel("Page suivante")
            .setStyle(ButtonStyle.Success)
            .setCustomId("nextPage");

        const button1 = new ButtonBuilder()
            .setLabel("Page précédente")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("previousPage");

        const row = new ActionRowBuilder()
            .addComponents(button1, button2);

        const msg = await message.reply({ embeds: [embed], components: [row], ephemeral: eph });

        let action_timeout = 30000;
        let currentPage = 0;

        let filter = (interaction) => {
            if (interaction.user.id !== message.user.id) return false;
            return true;
        }

        let collector = msg.createMessageComponentCollector({ filter, time: action_timeout });

        collector.on('collect', async interaction => {
            if (RewardInfo.find(info => info.IDMembre === message.member.id && info.serveurID === message.guild.id && info.isRunning === true)) {
                
                try {
                    if (maxPages <= 1) return interaction.reply({ content: "Il n'y a pas d'autre page à afficher !", ephemeral: true });
                        if (currentPage === maxPages - 1 && interaction.customId === "nextPage") {
                            currentPage = 0;
                        } else if (currentPage === 0 && interaction.customId === "previousPage") {
                            currentPage = maxPages - 1;
                        }
                        if (interaction.customId === "nextPage") {
                            currentPage++;
                        } else if (interaction.customId === "previousPage") {
                            currentPage--;
                        }
                        let reward = `**Rewards actuels du serveur**\n\n`;
                        let i = currentPage * 10 + 1;
                        for (const result of search.slice(currentPage * 10, currentPage * 10 + 10)) {
                            const role = message.guild.roles.cache.get(result.IDRole);
                            reward += `${i}. Rôle : ${role} - Niveau : ${result.level}\n`;
                            i++;
                        }
            
                        const embed = new EmbedBuilder()
                            .setTitle(message.guild.name)
                            .setDescription(reward)
                            .setColor("#007FFF")
                            .setFooter({ text: `Page ${currentPage + 1}/${maxPages}` });
            
                        const button2 = new ButtonBuilder()
                            .setLabel("Page suivante")
                            .setStyle(ButtonStyle.Success)
                            .setCustomId("nextPage");
            
                        const button1 = new ButtonBuilder()
                            .setLabel("Page précédente")
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId("previousPage");
            
                        const buttonRow = new ActionRowBuilder()
                            .addComponents(button1, button2);
            
                        interaction.update({ embeds: [embed], components: [buttonRow] });
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }
}