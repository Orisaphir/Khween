const fs = require("fs");

module.exports = async client => {

    try {
        const commandsFolder = fs.readdirSync("./commands").forEach(path => {
            if (path !== '.DS_Store') {
                fs.readdirSync(`./commands/${path}`).filter((file) => file.endsWith('.js')).forEach(file => {
                    let command = require(`../commands/${path}/${file}`)
                    client.commands.push(command)
                })
            }
        });
    }
    catch (e) {
        console.log(`Erreur lors du chargement des commandes: ${e}`);
    }
}