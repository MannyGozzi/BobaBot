const { stopSong } = require('../commands/utilities/play.js');

module.exports = {
    async execute(interaction) {
        await stopSong();
        interaction.deferUpdate();
    }
};