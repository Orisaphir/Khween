const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/twitch.sqlite',
});

const Twitch = sequelize.define('twitch', {
    IDServeur: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Channel: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
    },
    ChannelAnnounce: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
    },
    ClientID: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ClientSecret: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Token: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Valeur: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
});

module.exports = Twitch;