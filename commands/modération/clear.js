const { PermissionFlagsBits, SlashCommandBuilder, ChannelType } = require("discord.js");
const fs = require("fs");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('supprime des messages')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addNumberOption(option => option.setName("nombre").setDescription("Nombre de messages à supprimer").setRequired(true))
        .addChannelOption(option => option.setName("salon").setDescription("Où supprimer les messages").addChannelTypes(ChannelType.GuildText).setRequired(false)),

    async run(client, message, args) {
        const channel = message.options.getChannel("salon") ?? message.channel;
        const number = message.options.getNumber("nombre");

        if(number <= 0 || number > 100) return message.reply("Le nombre doit être compris entre 1 et 100 !")

        await message.deferReply({ ephemeral: true})

        try {

            const messages = await channel.bulkDelete(number)

            fs.writeFileSync('deletedMessages.json', JSON.stringify({ ID: client.user.id, Executor: message.user.id, AutoMod: false, Reason: "Clear" }))

            await message.followUp({content: `\`${messages.size}\` message(s) supprimé(s) dans le salon ${channel}!`, ephemeral: true})

        } catch (err) {

            const messages = [...(await channel.messages.fetch()).filter(m => !m.interaction && (Date.now() - m.createdAt) <= 1209600000).values()]

            if(messages.length <= 0) return message.followUp("Aucun messages supprimés car ils sont trop vieux (14j +) !")
            await channel.bulkDelete(messages)

            await message.followUp({content: `\`${messages.length}\` message(s) supprimé(s) seulement dans le salon ${channel} car les autres sont trop vieux (14j +)!`, ephemeral: true})
        }
    },
}