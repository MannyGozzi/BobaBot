const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('show all commands'),
    async execute(interaction) {
        await interaction.reply(`
        **Commands**
        /help - help
        /ping - ping
        /server - server
        /user - user
        /stats - display user stats`);
    },
};