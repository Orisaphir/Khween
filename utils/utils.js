//Variable pour les erreurs
var ErrorCode;
(function (ErrorCode){
    ErrorCode[ErrorCode["None"] = 0] = "None";
    ErrorCode[ErrorCode["InvalidValue"] = 1] = "InvalidValue";
    ErrorCode[ErrorCode["UpdateFailed"] = 2] = "UpdateFailed";
    ErrorCode[ErrorCode["CriticalError"] = 3] = "CriticalError";
})(ErrorCode || (ErrorCode = {}));
exports.ErrorCode = ErrorCode;

function quit(code = ErrorCode.None) {
    warnPut('\nFermeture de Khween... Erreur: ' + code)
    process.exit(code);
}
exports.quit = quit;

function put(text) {
    console.log(text);
}
exports.put = put;
function warnPut(text) {
    console.log('\x1b[31m' + text + '\x1b[0m');
}
exports.warnPut = warnPut;
function greenPut(text) {
    console.log('\x1b[32m' + text + '\x1b[0m');
}
exports.greenPut = greenPut;
function infoPut(text) {
    console.log('\x1b[33m' + text + '\x1b[0m');
}
exports.infoPut = infoPut;

function progress(percent = 0) {
    let buff = ''.padStart(Math.round(percent * 35), '#').padEnd(35, ' ');
    put('\r                                       ');
    put('\r[' + buff + '] ' + Math.round(percent * 100).toString() + '%');
}
exports.progress = progress;