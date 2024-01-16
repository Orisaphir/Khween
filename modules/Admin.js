const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/admin.sqlite',
});

const Admins = sequelize.define('admins', {
    Module: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    Valeur: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
});

module.exports = Admins;