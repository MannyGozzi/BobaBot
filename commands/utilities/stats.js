const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('show user stats'),
    async execute(interaction) {
        await interaction.reply(`
        user stats show here`);
    },
};