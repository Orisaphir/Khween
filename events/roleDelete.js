module.exports = async (client, role) => {
    const Emojis = require('./Emojis');
    const RoleID = role.id;
    const search = await Emojis.findOne({ where: { IDrole: RoleID } });
    if (!search)
        return;
    await Emojis.destroy({ where: { IDrole: RoleID } });
};