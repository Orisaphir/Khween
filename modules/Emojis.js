const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/reactionrole.sqlite',
});

const Emojis = sequelize.define('emojis', {
    IDServeur: Sequelize.STRING,
    IDChannel: Sequelize.STRING,
    IDmessage: Sequelize.STRING,
    IDemoji: Sequelize.STRING,
    IDrole: Sequelize.STRING,
});

module.exports = Emojis;