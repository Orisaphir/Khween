const fs = require("fs");
const path = require("path");
const { infoPut, warnPut, greenPut } = require("../utils/utils.js");

const ProjectRoot = path.resolve(__dirname, "..");

const Node_Modules = path.join(ProjectRoot, 'node_modules');
const Fix_Node_Modules = path.join(ProjectRoot, 'fix', 'node_modules');

const Social_Alert = path.join(
    Node_Modules,
    '@voidpkg',
    'social-alert',
    'src',
    'providers',
    'Twitch',
    'index.js'
);
const Fix_Social_Alert = path.join(ProjectRoot, 'fix', 'social-alert', 'index.js');

function copyDirRecursiveSync(srcDirPath, destDirPath) {
    fs.mkdirSync(destDirPath, { recursive: true });
    const entries = fs.readdirSync(srcDirPath, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDirPath, entry.name);
        const destPath = path.join(destDirPath, entry.name);

        if (entry.isDirectory()) {
            copyDirRecursiveSync(srcPath, destPath);
        } else if (entry.isFile()) {
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function copyMissingRecursiveSync(srcPath, destPath) {
    if (!fs.existsSync(srcPath)) return 0;
    const stat = fs.statSync(srcPath);

    // If destination doesn't exist, we can copy the whole subtree.
    if (!fs.existsSync(destPath)) {
        if (stat.isDirectory()) {
            copyDirRecursiveSync(srcPath, destPath);
        } else if (stat.isFile()) {
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            fs.copyFileSync(srcPath, destPath);
        }
        return 1;
    }

    // Destination exists: only fill in missing children, never overwrite.
    if (stat.isDirectory()) {
        const entries = fs.readdirSync(srcPath, { withFileTypes: true });
        let copied = 0;
        for (const entry of entries) {
            const childSrc = path.join(srcPath, entry.name);
            const childDest = path.join(destPath, entry.name);
            copied += copyMissingRecursiveSync(childSrc, childDest);
        }
        return copied;
    }

    // src is file but dest exists -> do not overwrite
    return 0;
}

async function CheckAndFix() {
    let fixApplied = false;
    let numberOfFiles = 0;
    try {
        if (fs.existsSync(Fix_Node_Modules)) {
            if (!fs.existsSync(Node_Modules)) {
                fs.mkdirSync(Node_Modules, { recursive: true });
            }

            const moduleEntries = fs.readdirSync(Fix_Node_Modules, { withFileTypes: true });
            for (const entry of moduleEntries) {
                if (!entry.isDirectory()) continue;

                const srcModuleDir = path.join(Fix_Node_Modules, entry.name);
                const destModuleDir = path.join(Node_Modules, entry.name);

                const copied = copyMissingRecursiveSync(srcModuleDir, destModuleDir);
                if (copied > 0) {
                    infoPut(`Fix node_modules: éléments manquants copiés pour ${entry.name}\n`);
                    fixApplied = true;
                    numberOfFiles++;
                }
            }
        }

        if (fs.existsSync(Social_Alert) && fs.existsSync(Fix_Social_Alert)) {
            const original = fs.readFileSync(Social_Alert, 'utf8');
            const fix = fs.readFileSync(Fix_Social_Alert, 'utf8');
            if (original !== fix) {
                fs.copyFileSync(Fix_Social_Alert, Social_Alert);
                infoPut('Fix appliqué à social-alert\n');
                fixApplied = true;
                numberOfFiles++;
            }
        }
        if (!fixApplied) {
            greenPut('Vérification des fichiers terminée.\n');
        } else {
            greenPut(`Vérification des fichiers terminée. ${numberOfFiles} fix ${numberOfFiles > 1 ? 'ont' : 'a'} été appliqué${numberOfFiles > 1 ? 's' : ''}.\n`);
        }
    } catch (e) {
        warnPut('Erreur lors de la vérification des fichiers: ' + e);
    }
}

exports.CheckAndFix = CheckAndFix;

if (require.main === module) {
    CheckAndFix().catch((e) => {
        warnPut('Erreur lors de la vérification des fichiers: ' + e);
        process.exit(1);
    });
}