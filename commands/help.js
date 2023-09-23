const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('help'),
    async execute(interaction) {
        await interaction.reply('view all available commands');
    },
};