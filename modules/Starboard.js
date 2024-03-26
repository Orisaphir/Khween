const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/starboard.sqlite',
});

const Starboard = sequelize.define('starboard', {
    IDServeur: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Emoji: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Reaction: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Emoji2: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Reaction2: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Emoji3: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Reaction3: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Valeur: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
});

module.exports = Starboard;