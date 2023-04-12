const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('débannir un membre')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => option.setName("membre").setDescription("personne à débannir").setRequired(true))
        .addStringOption(option => option.setName("raison").setDescription("raison du débannissement").setMaxLength(512).setAutocomplete(true)),

    async run(client, message, args) {
        const user = message.options.getUser("membre")
        const reason = message.options.getString("raison")  ?? "Aucune raison fournie.";
        const member = message.guild.members.cache.get(user.id)

        if (!(await message.guild.bans.fetch()).get(user.id)) return message.reply({content: "Ce membre n'est pas banni !", ephemeral: true})

        try {

            await message.reply(`${message.user} a débanni ${user.tag} pour la raison : \`${reason}\``)
            await message.guild.members.unban(user, { reason: reason })

        } catch (err) {

            return message.reply({content: "Pas de membre à débannir !", ephemeral: true})
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