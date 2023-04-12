const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('bannir un membre')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => option.setName("membre").setDescription("personne à bannir").setRequired(true))
        .addStringOption(option => option.setName("raison").setDescription("raison du bannissement").setMaxLength(512).setAutocomplete(true)),

    async run(client, message, args) {
        const user = message.options.getUser("membre")
        const reason = message.options.getString("raison")  ?? "Aucune raison fournie.";
        const member = message.guild.members.cache.get(user.id)

        if (message.user.id === user.id) return message.reply({content: "Essaie pas de te bannir !", ephemeral: true})
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply({content: "Ne ban pas le propriétaire du serveur !", ephemeral: true})
        if (!member?.bannable) return message.reply({content: "Je ne peux pas bannir ce membre !", ephemeral: true})
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({content: "Tu ne peux pas bannir ce membre !", ephemeral: true})

        try {

            try { await user.send(`Tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``) } catch (err) { }
            await message.reply(`${message.user} a banni ${user.tag} pour la raison : \`${reason}\``)
            await message.guild.bans.create(user.id, { reason: reason })

        } catch (err) {

            return message.reply({content: "Pas de membre à bannir !", ephemeral: true})
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