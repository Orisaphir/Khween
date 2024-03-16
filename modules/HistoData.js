const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/histodata.sqlite',
});

const HistoData = sequelize.define('histodata', {
    IDServeur: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Infos: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
    },
    Channel: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Message: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

module.exports = HistoData;