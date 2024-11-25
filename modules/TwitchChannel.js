const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/twitchchannel.sqlite',
});

const TwitchChannel = sequelize.define('twitchchannel', {
    IDServeur: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Channel: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
    },
});

module.exports = TwitchChannel;