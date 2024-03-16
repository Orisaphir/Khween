const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/level.sqlite',
});

const Level = sequelize.define('level', {
    IDMembre: {
        type: Sequelize.STRING,
        unique: false,
    },
    IDServeur: Sequelize.STRING,
    xp: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    level: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    }
});

module.exports = Level;