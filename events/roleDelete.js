module.exports = async (client, role) => {
    const Emojis = require('../modules/Emojis');
    const Infos = require('../modules/Infos');
    const Admins = require('../modules/Admin');
    const Reward = require('../modules/Reward');
    const RoleID = role.id;
    const search = await Emojis.findOne({ where: { IDrole: RoleID } });
    const searchverifyrole = await Infos.findOne({ where: { DiscordID: RoleID } });
    const searchreward = await Reward.findOne({ where: { IDRole: RoleID } });

    if (search)
        await Emojis.destroy({ where: { IDrole: RoleID } });

    if (searchverifyrole)
        await Infos.update({ Valeur: false }, { where: { DiscordID: RoleID } });
        await Infos.update({ DiscordID: null }, { where: { DiscordID: RoleID } });
        await Admins.update({ Valeur: false }, { where: { Module: "verify" } });
    if (searchreward)
        await Reward.destroy({ where: { IDRole: RoleID } });
};