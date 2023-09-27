const { SlashCommandBuilder } = require('@discordjs/builders');
const { stopSong } = require('./play.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing music and clear the queue'),
    async execute(interaction) {
        await stopSong();
        await interaction.reply(`**Stopping**`);
    }
};