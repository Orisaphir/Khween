//Modules pour le fonctionnement du programme
const { Khween } = require('./app.js');
const { CheckAndFix } = require('./fix/fix.js');
const { put, greenPut, infoPut, warnPut, progress, ErrorCode } = require('./utils/utils.js');
const fs = require('fs');
const extract_zip = require('extract-zip');
const path = require('path');
const readlineSync = require('readline-sync');

//Module discord.js
const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799);

//Discord Client
global.client = new Discord.Client({intents}, {partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.GuildMember, Discord.Partials.User, Discord.Partials.Reaction, Discord.Partials.ThreadMember] });

//Loading
const loadCommands = require("./loaders/loadCommands.js");
const loadEvents = require("./loaders/loadEvents.js");

//Fichier config
if (!fs.existsSync('./config.json')) {
    fs.writeFileSync('./config.json', JSON.stringify({
        "BOT_TOKEN": "",
        "ACTIVITY_TYPE": "Playing",
        "ACTIVITY_NAME": "modérer",
        "ACTIVITY_STATUS": "online",
        "ACTIVITY_URL": null,
        "MASTER_ID": true,
    }, null, 2));
    infoPut('Fichier config.json créé.');
}

// Vérifier que le fichier config.json a les bonnes valeurs
const configCheck = require('./config.json');
if (!configCheck.ACTIVITY_TYPE || !configCheck.ACTIVITY_NAME || !configCheck.ACTIVITY_STATUS || !configCheck.MASTER_ID) {
    const token = configCheck.BOT_TOKEN;
    let master = true;
    if (configCheck.MASTER_ID) {
        master = configCheck.MASTER_ID;
    }
    let activityType = "Playing";
    if (configCheck.ACTIVITY_TYPE) {
        activityType = configCheck.ACTIVITY_TYPE;
    }
    let activityName = "modérer";
    if (configCheck.ACTIVITY_NAME) {
        activityName = configCheck.ACTIVITY_NAME;
    }
    let activityStatus = "online";
    if (configCheck.ACTIVITY_STATUS) {
        activityStatus = configCheck.ACTIVITY_STATUS;
    }
    let activityUrl = null;
    if (configCheck.ACTIVITY_URL) {
        activityUrl = configCheck.ACTIVITY_URL;
    }
    fs.rmSync('./config.json');
    fs.writeFileSync('./config.json', JSON.stringify({
        "BOT_TOKEN": token,
        "ACTIVITY_TYPE": activityType,
        "ACTIVITY_NAME": activityName,
        "ACTIVITY_STATUS": activityStatus,
        "ACTIVITY_URL": activityUrl,
        "MASTER_ID": master,
    }, null, 2));
    infoPut('\n\nFichier config.json mis à jour. Veuillez redémarrer Khween.\n');
    process.exit(1);
}

const config = require("./config.json");

//Music
const { Player } = require('discord-player');
client.config = require('./playerconf.js');
global.player = new Player(client, client.config.opt.discordPlayer);

//Login
main()

async function main() {
    await init();
}

async function init() {
    if (config.BOT_TOKEN === '') {
        infoPut('Veuillez entrer le token du bot.\n');
        await getToken();
    }
    Khween.package = await getPackage();
    put(`\nKhween v${Khween.package.version}`);
    infoPut('Initialisation de Khween...\n');
    Khween.token = config.BOT_TOKEN;
    Khween.activity_type = config.ACTIVITY_TYPE;
    Khween.activity_name = config.ACTIVITY_NAME;
    Khween.activity_status = config.ACTIVITY_STATUS;
    Khween.activity_url = config.ACTIVITY_URL;
    if (config.MASTER_ID === '' || config.MASTER_ID === true) {
        infoPut('Veuillez entrer l\'ID du propriétaire du bot.\n');
        await getMaster();
    }
    Khween.master_id = config.MASTER_ID;
    infoPut('\nRecherche de mises à jour...\n')
    let newUpdate = await shouldUpdate();
    if (newUpdate === true) {
        let response = await updateQuestion();
        if (response === true) {
            let updateSuccess = await update();
            if (updateSuccess === true) {
                greenPut(`\nMise à jour terminée. Veuillez redémarrer Khween.`);
                quit(ErrorCode.None);
            }
            warnPut('Erreur: Échec de la mise à jour de Khween.');
        } else {
            infoPut(`\nMise à jour ignorée. Khween v${Khween.package.version} sera utilisée.\n`);
        }
    } else if (newUpdate === false) {
        greenPut('Aucune mise à jour disponible.\n');
    }
    infoPut('\nVérification des fichiers...\n');
    await CheckAndFix();
    infoPut('\nConnexion à Discord...\n');
    await loginWithRetry();
    client.commands = [];
    infoPut('\n\nChargement des commandes...')
    loadCommands(client);
    loadEvents(client);
    Khween.client = client;
}

async function unzip(zip_file_path, to_directory) {
    try {
        await (0, extract_zip)(path.resolve(zip_file_path), {dir: path.resolve(to_directory)});
        return true;
    }
    catch (e) {
        warnPut(`Erreur: Impossible d'extraire le fichier ${zip_file_path} vers ${to_directory}.`);
        put(e)
        return false;
    }
}

async function getPackage() {
    const path = './package.json';
    const check = fs.readFileSync(path);
    return JSON.parse(check.toString());
}

async function shouldUpdate() {
    if (fs.existsSync('./.ori') === true)
        return false;
    let query;
    try {
        query = await fetch('https://api.github.com/repos/Orisaphir/Khween/tags')
    }
    catch (e) {
        warnPut(`Erreur: Imposssible d'accéder à Github.`)
        return false;
    }
    let data;
    try {
        data = await query.json();
    }
    catch (e) {
        warnPut(`Erreur: Impossible de lire les données de Github.`)
        return false;
    }
    if (typeof data !== 'object' || data === null || data === undefined) {
        warnPut(`Erreur: Les données de Github sont invalides.`)
        return false;
    }
    let latest = data[0];
    if (latest === 'object' || data === null || data === undefined) {
        warnPut(`Erreur: Les données de Github sont invalides.`)
        return false;
    }
    if ('name' in latest && Khween.package.version !== latest['name']) {
        const newVersion = String(latest['name']).replace(/[^0-9\.\,\-]/g, '');
        try {
            query = await fetch(`https://api.github.com/repos/Orisaphir/Khween/releases/tags/${newVersion}`);
        }
        catch (e) {
            warnPut(`Erreur: Impossible de lire les données de la dernière version de Khween.`);
        }
        try {
            latest = await query.json();
        }
        catch (e) {
            warnPut(`Erreur: Impossible de lire les données de la dernière version de Khween.`);
        }
        infoPut(`\nUne nouvelle version de Khween est disponible: v${newVersion}\n\n${latest['body'] ? latest['body'] : 'Aucun changelog trouvé.'}\n\nY pour mettre à jour, N pour ignorer.`);
        return true;
    }
    return false;
}

async function updateQuestion() {
    let readline = await readlineOpen();
    while (true) {
        const response = await new Promise((resolve) => {
            readline.question('Voulez-vous mettre à jour Khween ? (Y/N) ', response => {
                if (response.toLowerCase() === 'y' || response.toLowerCase() === 'yes' || response.toLowerCase() === 'oui' || response.toLowerCase() === 'o') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
        if (response === true || response === false) {
            await readlineClose(readline);
            return response;
        }
    }
}

async function update() {
    infoPut(`\nMise à jour de Khween...`);
    progress(0);
    let query;
    try {
        query = await fetch('https://api.github.com/repos/Orisaphir/Khween/tags');
    }
    catch (e) {
        warnPut(`Erreur: Imposssible d'accéder à Github.`);
        return false;
    }
    let data;
    try {
        data = await query.json();
    }
    catch (e) {
        warnPut(`Erreur: Impossible de lire les données de Github.`);
        quit(ErrorCode.InvalidValue);
        return false;
    }
    latest = data[0];
    const version = String(latest['name']).replace(/[^0-9\.\,\-]/g, '');
    try {
        query = await fetch(`https://github.com/Orisaphir/Khween/releases/download/${version}/Khween.zip`);
    }
    catch (e) {
        warnPut(`Erreur: Impossible de télécharger la mise à jour.`);
        quit(ErrorCode.UpdateFailed);
        return false;
    }
    progress(0.1);
    let buffer;
    try {
        buffer = await query.arrayBuffer();
    }
    catch (e) {
        warnPut('Erreur: Données reçues de Github invalides.');
        quit(ErrorCode.InvalidValue)
        return false;
    }
    progress(0.2);
    const maj = Buffer.from(buffer);
    fs.writeFileSync('./temp.zip', maj);
    if (fs.existsSync('./TEMP') === false)
        fs.mkdirSync('./TEMP');
    progress(0.3);
    fs.cpSync('./bdd', './TEMP/bdd', { recursive: true, force: true });
    fs.cpSync('./config.json', './TEMP/config.json', { recursive: true, force: true });
    progress(0.4);
    process.chdir('./');
    try {
        fs.readdirSync('./').forEach(path => {
            if (path !== 'TEMP' && path !== 'temp.zip' && path !== '.git') {
                fs.rmSync(path, { recursive: true, force: true });
            }
        });
    }
    catch (e) {
        warnPut('Erreur: Impossible de supprimer les fichiers, une réinstallation manuelle est nécessaire. Les fichiers tels que les bases de données et le fichier config.json ont été sauvegardés dans le dossier TEMP.');
        warnPut(`\n\nErreur: ${e}\n`)
        quit(ErrorCode.CriticalError);
        return false;
    }
    progress(0.5);
    await unzip('./temp.zip', './');
    progress(0.6);
    if (fs.existsSync('./Khween-main') === false) {
        warnPut(`Erreur: Impossible d'extraire les fichiers de la mise à jour. Une réinstallation manuelle est nécessaire. Les fichiers tels que les bases de données et le fichier config.json ont été sauvegardés dans le dossier TEMP.`);
        quit(ErrorCode.CriticalError);
        return false;
    };
    progress(0.7);
    fs.cpSync('./Khween-main', './', { recursive: true, force: false });
    fs.rmSync('./Khween-main', { recursive: true, force: true });
    progress(0.8);
    if (fs.existsSync('./bdd') === false)
        fs.mkdirSync('./bdd');
    fs.cpSync('./TEMP/bdd', './bdd', { recursive: true, force: true });
    fs.cpSync('./TEMP/config.json', './config.json', { recursive: true, force: true });
    progress(0.9);
    fs.rmSync('./TEMP', { recursive: true, force: true });
    fs.rmSync('./temp.zip', { force: true, recursive: true });
    progress(1);
    greenPut(`La mise à jour a bien été installée.`);
    return true;
}

async function getToken() {
    while (true) {
        const token = readlineSync.question('Token: ', {
            hideEchoBack: true
        });

        if (token.trim() === '') {
            infoPut('Veuillez entrer un token valide.');
        } else {
            let config = require('./config.json');
            config.BOT_TOKEN = token;
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
            greenPut('Token enregistré.\n');
            break;
        }
    }
}

async function getMaster() {
    let readline = await readlineOpen();
    while (true) {
        const master = await new Promise((resolve) => {
            readline.question('ID du propriétaire du Bot: ', master => {
                if (master.trim() === '') {
                    infoPut('Veuillez entrer un ID valide.');
                    resolve(null);
                } else {
                    let config = require('./config.json');
                    config.MASTER_ID = master;
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
                    greenPut('ID enregistré.\n');
                    resolve(master);
                }
            });
        });

        if (master) {
            await readlineClose(readline);
            break;
        }
    }

}
exports.getMaster = getMaster;

async function loginWithRetry() {
    let loggedIn = false;
    while (!loggedIn) {
        try {
            await client.login(Khween.token);
            loggedIn = true;
            greenPut('Connecté à Discord\n');
        } catch (error) {
            warnPut('Erreur: Impossible de se connecter à Discord avec le token actuel. Veuillez entrer un nouveau token.');
            await getToken();
            Khween.token = config.BOT_TOKEN;
        }
    }
}

async function searchMaster() {
    let masterFound = false;
    const botGuilds = client.guilds.cache;
    while (!masterFound) {
        for (const [id, guild] of botGuilds) {
            try {
                const member = await guild.members.fetch(Khween.master_id);
                if (member) {
                    if (member.user.bot === false) {
                        put(`\x1b[32m${member.user.globalName}\x1b[0m a été trouvé dans le serveur \x1b[32m${guild.name}.\x1b[0m\n`);
                        greenPut('Propriétaire du bot trouvé.\n\n');
                        masterFound = true;
                        break;
                    } else {
                        throw new Error('bot');
                    }
                }
            } catch (error) {
                if (error.message === 'bot') {
                    warnPut('Erreur: Le propriétaire du bot ne peut pas être un bot. Veuillez entrer un nouvel ID.\n\x1b[33mLe bot et le propriétaire doivent être dans le même serveur\x1b[0m');
                } else {
                    warnPut('Erreur: Impossible de trouver le propriétaire du bot. Veuillez entrer un nouvel ID.\n\x1b[33mLe bot et le propriétaire doivent être dans le même serveur\x1b[0m');
                }
                await getMaster();
                Khween.master_id = config.MASTER_ID;
            }
        }
    }
}
exports.searchMaster = searchMaster;
async function readlineOpen(){
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return readline;
}
exports.readlineOpen = readlineOpen;
async function readlineClose(readline){
    readline.close();
}
exports.readlineClose = readlineClose;