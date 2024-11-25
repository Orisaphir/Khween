let twitchInstance = null;

function setTwitchInstance(instance) {
    twitchInstance = instance;
    twitchInstance.start();
}

function getTwitchInstance() {
    return twitchInstance;
}

module.exports = {
    setTwitchInstance,
    getTwitchInstance
};