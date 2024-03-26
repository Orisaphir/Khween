const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/starboardhisto.sqlite',
});

const StarboardHisto = sequelize.define('starboardhisto', {
    IDServeur: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Channel: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
    },
    Message: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Reaction: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Embed: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = StarboardHisto;