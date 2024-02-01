//Modules pour le fonctionnement du programme
const fs = require('fs');
const extract_zip = require('extract-zip');
const path = require('path');

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

var ErreurCode;
(function (ErreurCode){
    ErreurCode[ErreurCode["None"] = 0] = "None";
    ErreurCode[ErreurCode["InvalidValue"] = 1] = "InvalidValue";
    ErreurCode[ErreurCode["UpdateFailed"] = 2] = "UpdateFailed";
    ErreurCode[ErreurCode["CriticalError"] = 3] = "CriticalError";
})(ErreurCode || (ErreurCode = {}));

class Package {
    version = '';
}

class Khween {
    package = new Package();

}

//Login
main()

async function main() {
    await init();
}

async function init() {
    Khween.package = await getPackage();
    put(`\nKhween v${Khween.package.version}`);
    put('Initialisation de Khween...\n');
    put('\nRecherche de mises à jour...\n')
    await shouldUpdate();
    if (await shouldUpdate() === true) {
        put('\nMise à jour disponible.\n')
        let updateSuccess = await update();
        if (updateSuccess === true) {
            put(`\nMise à jour terminée. Veuillez redémarrer Khween.`);
            quit(ErreurCode.None);
        }
        put('Erreur: Échec de la mise à jour de Khween.');
    } else {
        put('Aucune mise à jour disponible.\n');
    }
    put('\nConnexion à Discord...\n');
    client.login(config.BOT_TOKEN);
    put('Connecté à Discord\n');
    client.commands = [];
    put('\n\nChargement des commandes...')
    loadCommands(client);
    loadEvents(client);
}

function quit(code = ErreurCode.None) {
    put('\nFermeture de Khween... Erreur: ' + code)
    process.exit(code);
}

function put(text) {
    console.log(text);
}

function progress(percent = 0) {
    let buff = ''.padStart(Math.round(percent * 35), '#').padEnd(35, ' ');
    put('\r                                       ');
    put('\r[' + buff + '] ' + Math.round(percent * 100).toString() + '%');
}

async function unzip(zip_file_path, to_directory) {
    try {
        await (0, extract_zip)(path.resolve(zip_file_path), {dir: path.resolve(to_directory)});
        return true;
    }
    catch (e) {
        put(`Erreur: Impossible d'extraire le fichier ${zip_file_path} vers ${to_directory}.`);
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
        put(`Erreur: Imposssible d'accéder à Github.`)
        return false;
    }
    let data;
    try {
        data = await query.json();
    }
    catch (e) {
        put(`Erreur: Impossible de lire les données de Github.`)
        return false;
    }
    if (typeof data !== 'object' || data === null || data === undefined) {
        put(`Erreur: Les données de Github sont invalides.`)
        return false;
    }
    let latest = data[0];
    if (latest === 'object' || data === null || data === undefined) {
        put(`Erreur: Les données de Github sont invalides.`)
        return false;
    }
    if ('name' in latest && Khween.package.version !== latest['name']) {
        const newVersion = String(latest['name']).replace(/[^0-9\.\,\-]/g, '');
        put(`\nUne nouvelle version de Khween est disponible: ${newVersion}\n`);
        return true;
    }
    return false;
}

async function update() {
    put(`\nMise à jour de Khween...`);
    progress(0);
    let query;
    try {
        query = await fetch('https://api.github.com/repos/Orisaphir/Khween/tags');
    }
    catch (e) {
        put(`Erreur: Imposssible d'accéder à Github.`);
        return false;
    }
    let data;
    try {
        data = await query.json();
    }
    catch (e) {
        put(`Erreur: Impossible de lire les données de Github.`);
        quit(ErreurCode.InvalidValue);
        return false;
    }
    latest = data[0];
    const version = String(latest['name']).replace(/[^0-9\.\,\-]/g, '');
    try {
        query = await fetch(`https://github.com/Orisaphir/Khween/releases/download/${version}/Khween.zip`);
    }
    catch (e) {
        put(`Erreur: Impossible de télécharger la mise à jour.`);
        quit(ErreurCode.UpdateFailed);
        return false;
    }
    progress(0.1);
    let buffer;
    try {
        buffer = await query.arrayBuffer();
    }
    catch (e) {
        put('Erreur: Données reçues de Github invalides.');
        quit(ErreurCode.InvalidValue)
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
        put('Erreur: Impossible de supprimer les fichiers, une réinstallation manuelle est nécessaire. Les fichiers tels que les bases de données et le fichier config.json ont été sauvegardés dans le dossier TEMP.');
        put(`\n\nErreur: ${e}\n`)
        quit(ErreurCode.CriticalError);
        return false;
    }
    progress(0.5);
    await unzip('./temp.zip', './');
    progress(0.6);
    if (fs.existsSync('./Khween-main') === false) {
        put(`Erreur: Impossible d'extraire les fichiers de la mise à jour. Une réinstallation manuelle est nécessaire. Les fichiers tels que les bases de données et le fichier config.json ont été sauvegardés dans le dossier TEMP.`);
        quit(ErreurCode.CriticalError);
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
    put(`La mise à jour a bien été installée.`);
    return true;
}