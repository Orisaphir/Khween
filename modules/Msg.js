const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/msg.sqlite',
});

const Msg = sequelize.define('msg', {
    IDServeur: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Infos: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
    },
    Part1: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Mention: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    Part2: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Niveau: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    Part3: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

module.exports = Msg;