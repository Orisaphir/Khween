const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './bdd/ticket.sqlite',
});

const ticketSchema = sequelize.define('Ticket', {
    GuildID: Sequelize.STRING,
    MemberID: Sequelize.STRING,
    TicketID: Sequelize.STRING,
    ChannelID: Sequelize.STRING,
    ClosedID: Sequelize.BOOLEAN,
    LockedID: Sequelize.BOOLEAN,
    Type: Sequelize.STRING,
});

module.exports = ticketSchema;