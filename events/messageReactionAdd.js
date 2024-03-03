module.exports = async (client, reaction, user) => {
    if(user.bot) return;
    const Emojis = require('../modules/Emojis');
    const message = reaction.message;
    const member = message.channel.guild.members.cache.find(member => member.user === user);

    const messageID = message.id;
    const emojiData = reaction.emoji;
    const serveurID = message.guild.id;

    //On vérifie que l'émoji est custom ou pas
    let emojiName = "";
    if (emojiData.id) {
        emojiName = "<:" + emojiData.name + ":" + emojiData.id + ">";
    }
    else {
        emojiName = reaction.emoji.name;
    }

    // On vérifie que l'emoji existe bien, dans le doute
    if (!emojiName) {
        return;
    }

    // On cherche la ligne avec cet emoji et ce message
    const search = await Emojis.findOne({ where: { IDMessage: messageID, IDemoji:emojiName, IDServeur: serveurID } });

    // Si rien de trouvé, osef, on passe
    if (!search)
        return;
    const roleID = search.get('IDrole');

    // Seulement s'il n'a pas le rôle
    if (member.roles.cache.find(r => r.id === roleID)) {
        return;
    }

    // On récupère le rôle
    const role = message.guild.roles.cache.find(r => r.id === roleID);

    // Rôle n'existe pas ? Osef du reste
    if (!role)
        return;

    // On ajoute
    member.roles.add(role);
};