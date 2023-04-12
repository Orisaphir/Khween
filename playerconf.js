module.exports = {
    opt: {
        maxVol: 100,
        leaveOnEnd: true,
        defaultvolume: 10,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
