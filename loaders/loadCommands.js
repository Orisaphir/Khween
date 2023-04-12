const fs = require("fs")

module.exports = async client => {

    const commandsFolder = fs.readdirSync("./commands");
    for (const folder of commandsFolder) {
        const commandFiles = fs
            .readdirSync(`./commands/${folder}`)
            .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            let command = require(`../commands/${folder}/${file}`)
            client.commands.push(command)
        }
    }
}