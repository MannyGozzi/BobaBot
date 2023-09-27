const { SlashCommandBuilder } = require('@discordjs/builders');
const { skipSong } = require('./play.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip to the next song in queue'),
    async execute(interaction) {
        await skipSong(interaction);
    }
};