const Level = require("../modules/xp")

module.exports = async (client, message, member) => {

    if (message.author.bot) return;

    const MembreID = message.author.id;
    const ServeurID = message.guild.id;
    function generateXp() {
        let min = 10;
        let max = 20;

        return Math.floor(Math.random() * (max - min)) + min
    }

    const search = await Level.findOne({ where: { IDMembre: MembreID } });
    if (!search) {

        try {
            let champs = {
                IDMembre: MembreID,
                IDServeur: ServeurID,
                xp: 1,
                level: 1,
            }
            Level.create(champs);
            message.channel.send(`🎊 félicitations, ${message.author.username} ! le **_niveau 1_** est entre tes mains ! encore un effort et peut-être que tu obtiendras **_l'anneau unique_** 🎊`)
        } catch (err) {
            message.reply({ content: "J'ai eu une erreur !", ephemeral: true })
            console.error(err)
        };
    } else {

        const xp = await search.get("xp");
        var xpavant = Number(xp), ge = Number(generateXp()), result;
        result = xpavant + ge;

        const level = await search.get("level");
        const xplevel = level * level * 50
        resultLevel = level + 1

        try {

            Level.update({ xp: result }, { where: { IDMembre: MembreID} });

            if(xp >= xplevel){
                Level.update({ level: resultLevel }, { where: { IDMembre: MembreID} });
                Level.update({ xp: 0 }, { where: { IDMembre: MembreID} });
                message.channel.send(`🎊 félicitations, ${message.author.username} ! le **_niveau ${resultLevel}_** est entre tes mains ! encore un effort et peut-être que tu obtiendras **_l'anneau unique_** 🎊`)
            }
        } catch (err) {
            message.reply({ content: "J'ai eu une erreur !", ephemeral: true })
            console.error(err)
        };
    }
}