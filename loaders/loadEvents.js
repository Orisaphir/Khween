const { readdirSync } = require("fs")

module.exports = async client => {

    readdirSync("./events").filter(f => f.endsWith("js")).forEach(async file => {

        let event = require(`../events/${file}`)
        client.on(file.split(".js").join(""), event.bind(null, client))
        console.log(`${file.split(".js").join("")} correctement chargé`)
    })
}