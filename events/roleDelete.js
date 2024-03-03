module.exports = async (client, role) => {
    const Emojis = require('../modules/Emojis');
    const Infos = require('../modules/Infos');
    const Admins = require('../modules/Admin');
    const Reward = require('../modules/Reward');
    const RoleID = role.id;
    const serveurID = role.guild.id;
    const search = await Emojis.findOne({ where: { IDrole: RoleID, IDServeur: serveurID } });
    const searchverifyrole = await Infos.findOne({ where: { DiscordID: RoleID, IDServeur: serveurID } });
    const searchreward = await Reward.findOne({ where: { IDRole: RoleID, IDServeur: serveurID } });

    if (search)
        await Emojis.destroy({ where: { IDrole: RoleID, IDServeur: serveurID } });

    if (searchverifyrole)
        await Infos.update({ Valeur: false }, { where: { DiscordID: RoleID, IDServeur: serveurID } });
        await Infos.update({ DiscordID: null }, { where: { DiscordID: RoleID, IDServeur: serveurID } });
        await Admins.update({ Valeur: false }, { where: { Module: "verify", IDServeur: serveurID } });
    if (searchreward)
        await Reward.destroy({ where: { IDRole: RoleID, IDServeur: serveurID } });
};