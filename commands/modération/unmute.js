const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('unmute un membre')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option.setName("membre").setDescription("personne à mute").setRequired(true))
        .addStringOption(option => option.setName("raison").setDescription("la raison de l'unmute").setMaxLength(512).setAutocomplete(true)),

    async run(client, message, args) {
        const user = message.options.getUser("membre")
        const reason = message.options.getString("raison") ?? "Aucune raison fournie.";
        const member = message.guild.members.cache.get(user.id)

        if (message.user.id === user.id) return message.reply({content: "Essaie pas de t'unmute !", ephemeral: true})
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply({content: "Le propriétaire du serveur n'a pas pu être mute !", ephemeral: true})
        if (!member.moderatable) return message.reply({content: "Je ne peux pas unmute ce membre !", ephemeral: true})
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({content: "Tu ne peux pas unmute ce membre !", ephemeral: true})
        if(!member.isCommunicationDisabled()) return message.reply({content: "Ce membre n'est pas mute !", ephemeral: true})

        try {

            try { await user.send(`Tu as été unmute du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``) } catch (err) { }
            await message.reply(`${message.user} a unmute ${user.tag} pour la raison : \`${reason}\``)
            await member.timeout(null, reason)

        } catch (err) {

            return message.reply({content: "Pas de membre à mute !", ephemeral: true})
        }
    },

    async autocomplete(inter) {
        const focusedValue = inter.options.getFocused();
        const choices = ['Bavure', 'Libéré.e sous bracelet'];
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await inter.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    }
}