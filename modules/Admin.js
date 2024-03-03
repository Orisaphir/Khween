const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/admin.sqlite',
});

const Admins = sequelize.define('admins', {
    IDServeur: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Module: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Valeur: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
});

module.exports = Admins;