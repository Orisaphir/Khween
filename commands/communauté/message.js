const { PermissionFlagsBits, SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('message')
        .setDescription('envoyer un message dans un channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addChannelOption(option => option.setName("salon").setDescription("Salon où envoyer le message").addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addStringOption(option => option.setName("message").setDescription("Message à envoyer").setMaxLength(2000).setRequired(true)),
    
    async run(client, message, args) {
        const channel = message.options.getChannel("salon");
        const messageContent = message.options.getString("message");

        try {

            await message.reply({content: "Message envoyé !", ephemeral: true})
            await channel.sendTyping();
            setTimeout(async () => {
                await channel.send(messageContent)
            }, 5000);
            
        } catch (err) {

            return message.reply({content: "Erreur lors de l'envoi du message", ephemeral: true})
        }
    }
};