const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick un membre')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => option.setName("membre").setDescription("personne à kick").setRequired(true))
        .addStringOption(option => option.setName("raison").setDescription("raison du kick").setMaxLength(512).setAutocomplete(true)),

    async run(client, message, args) {
        const user = message.options.getUser("membre")
        const reason = message.options.getString("raison")  ?? "Aucune raison fournie.";
        const member = message.guild.members.cache.get(user)

        if (message.user.id === user) return message.reply({content: "Essaie pas de te kick !", ephemeral: true})
        if ((await message.guild.fetchOwner()).id === user) return message.reply({content: "Ne kick pas le propriétaire du serveur !", ephemeral: true})
        if (!member?.kickable) return message.reply({content: "Je ne peux pas kick ce membre !", ephemeral: true})
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({content: "Tu ne peux pas kick ce membre !", ephemeral: true})

        try {

            try { await user.send(`Tu as été kick du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``) } catch (err) { }
            await message.reply(`${message.user} a kick ${user.tag} pour la raison : \`${reason}\``)
            await member.kick(reason)

        } catch (err) {

            return message.reply({content: "Pas de membre à kick !", ephemeral: true})
        }
    },

    async autocomplete(inter) {
        const focusedValue = inter.options.getFocused();
		const choices = ['Insultes', 'Trolling', 'Non-respect des règles', 'Spam', 'Piratage', "Aucune raison, c'est juste gratuit"];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await inter.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    }
}