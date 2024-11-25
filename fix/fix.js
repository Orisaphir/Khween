const fs = require("fs");
const { infoPut, warnPut, greenPut, quit, ErrorCode } = require("../utils/utils.js");

const Social_Alert = './node_modules/@voidpkg/social-alert/src/providers/Twitch/index.js';

async function CheckAndFix(){
    let fixApplied = false;
    let numberOfFiles = 0;
    try {
        if (fs.existsSync(Social_Alert)) {
            const original = fs.readFileSync(Social_Alert, 'utf8');
            const fix = fs.readFileSync('./fix/social-alert/index.js', 'utf8');
            if (original !== fix) {
                fs.copyFileSync('./fix/social-alert/index.js', Social_Alert);
                infoPut('Fix appliqué à social-alert\n');
                fixApplied = true;
                numberOfFiles++;
            }
        }
        if (!fixApplied) {
            greenPut('Vérification des fichiers terminée.\n');
        } else {
            greenPut(`Vérification des fichiers terminée. ${numberOfFiles} fix ${numberOfFiles > 1 ? 'ont' : 'a'} été appliqué${numberOfFiles > 1 ? 's' : ''}.\n`);
            infoPut('\nRedémarrage du bot nécessaire pour appliquer les changements.');
            quit(ErrorCode.None);
        }
    } catch (e) {
        warnPut('Erreur lors de la vérification des fichiers: ' + e);
    }
}

exports.CheckAndFix = CheckAndFix;