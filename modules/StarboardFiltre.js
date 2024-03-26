const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/starboardfiltre.sqlite',
});

const StarboardFiltre = sequelize.define('starboardfiltre', {
    IDServeur: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Channel: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
    },
    Reaction: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = StarboardFiltre;