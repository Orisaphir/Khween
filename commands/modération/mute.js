const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('mute un membre')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option.setName("membre").setDescription("personne à mute").setRequired(true))
        .addStringOption(option => option.setName("durée").setDescription("Seconde : s / Minutes : m / Heures : h / Jours : d (exemple : 7d pour 7 jours)").setRequired(true))
        .addStringOption(option => option.setName("raison").setDescription("la raison du mute").setMaxLength(512).setAutocomplete(true)),

    async run(client, message, args) {
        const user = message.options.getUser("membre")
        const time = message.options.getString("durée")
        const reason = message.options.getString("raison") ?? "Aucune raison fournie.";
        const member = message.guild.members.cache.get(user.id)

        if(!ms(time)) return message.reply({content: "Durée invalide : format non-reconnu !", ephemeral: true})
        if(ms(time) > ms("28d")) return message.reply({content: "Le mute ne peut pas durer plus de 28 jours !", ephemeral: true})
        if (message.user.id === user.id) return message.reply({content: "Essaie pas de te mute !", ephemeral: true})
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply({content: "Ne mute pas le propriétaire du serveur !", ephemeral: true})
        if (!member.moderatable) return message.reply({content: "Je ne peux pas mute ce membre !", ephemeral: true})
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({content: "Tu ne peux pas mute ce membre !", ephemeral: true})
        if(member.isCommunicationDisabled()) return message.reply({content: "Ce membre est déjà mute !", ephemeral: true})

        try {

            try { await user.send(`Tu as été mute du serveur ${message.guild.name} pendant ${time} par ${message.user.tag} pour la raison : \`${reason}\``) } catch (err) { }
            await message.reply(`${message.user} a mute ${user.tag} pendant ${time} pour la raison : \`${reason}\``)
            await member.timeout(ms(time), reason)

        } catch (err) {

            return message.reply({content: "Pas de membre à mute !", ephemeral: true})
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