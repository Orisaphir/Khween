//Module discord.js
const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799);

//Discord Client
global.client = new Discord.Client({intents});
client.commands = new Discord.Collection

//Loading
const loadCommands = require("./loaders/loadCommands");
const loadEvents = require("./loaders/loadEvents");

//Fichier config
const config = require("./config.json");

//Music
const { Player } = require('discord-player');
client.config = require('./playerconf');
global.player = new Player(client, client.config.opt.discordPlayer);

//Login
client.login(config.BOT_TOKEN);
client.commands = [];
loadCommands(client);
loadEvents(client);