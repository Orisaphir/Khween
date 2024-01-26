const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/infos.sqlite',
});

const Infos = sequelize.define('infos', {
    Infos: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    Valeur: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    DiscordID: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

module.exports = Infos;