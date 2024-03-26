const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const StarboardFiltre = require('../../modules/StarboardFiltre');

module.exports = {

    command: new SlashCommandBuilder()
        .setName('starboardfiltered')
        .setDescription('Permet d\'ajouter un filtre pour un channel sur le starboard')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((options) => options.setName('channel').setDescription('Channel filtrer').setRequired(true))
        .addIntegerOption((options) => options.setName('reaction').setDescription('Nombre de réactions minimum pour ce channel (0 pour totalement le filtrer)').setRequired(true)),

    async run(_, message) {
        const ServeurID = message.guild.id;

        const ChannelID = message.options.getChannel('channel');
        const Reaction = message.options.getInteger('reaction');
        let blacklist = false;
        if (Reaction <= 0) {
            blacklist = true;
        }
        const StarboardInfos = await StarboardFiltre.findOne({ where: { IDServeur: ServeurID, Channel: ChannelID.id } });
        
        try {
            if (StarboardInfos) {
                if (blacklist) {
                    await StarboardFiltre.update({ Reaction: Reaction }, { where: { IDServeur: ServeurID, Channel: ChannelID.id } });
                    return message.reply({ content: `Le salon <#${ChannelID.id}> a bien été complètement filtré. Le Starboard n'agira pas dedans.`, ephemeral: true });
                }
                else {
                    await StarboardFiltre.update({ Reaction: Reaction }, { where: { IDServeur: ServeurID, Channel: ChannelID.id } });
                }
            } else {
                if (blacklist) {
                    await StarboardFiltre.create({ IDServeur: ServeurID, Channel: ChannelID.id, Reaction: Reaction });
                    return message.reply({ content: `Le salon <#${ChannelID.id}> a bien été complètement filtré. Le Starboard n'agira pas dedans.`, ephemeral: true });
                }
                else {
                    await StarboardFiltre.create({ IDServeur: ServeurID, Channel: ChannelID.id, Reaction: Reaction });
                }
            }
            await message.reply({ content: `Le salon <#${ChannelID.id}> a bien été filtré. Il nécessite maintenant ${Reaction} réactions avant d'être étoilé`, ephemeral: true });
        } catch (err) {
            message.reply({ content: 'Une erreur est survenue', ephemeral: true });
            console.error("Erreur lors de la config StarboardFiltre:\n\n" + err);
        }
    }
};
