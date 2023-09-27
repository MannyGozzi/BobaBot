const { skipSong } = require('../commands/utilities/play.js');

module.exports = {
    async execute(interaction) {
        await skipSong(interaction);
    }
};