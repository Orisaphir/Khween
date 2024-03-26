const { Discord, Routes, SlashCommandBuilder, ReactionUserManager } = require("discord.js");
const { REST } = require("@discordjs/rest")
const { greenPut } = require("../index")

module.exports = async client => {

    let commands = [];

    client.commands.forEach( async command => {
        if(command.command) {

            await commands.push(command.command.toJSON())
            // console.log("/" + command.command.toJSON().name + " chargé")
        }
    });

    const rest = new REST({version: "10"}).setToken(client.token)

    await rest.put(Routes.applicationCommands(client.user.id), {body: commands})
    greenPut("Les commandes slashs sont prêtes\n")
}