const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/cooldown.sqlite',
});

const Cooldown = sequelize.define('cooldown', {
    IDServeur: Sequelize.STRING,
    cooldown: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    }
});

module.exports = Cooldown;