const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('show all commands'),
    async execute(interaction) {
        await interaction.reply(`
        **Commands**
        /play [ youtube-url ]
        /skip
        /stop
        /pausetoggle
        /stats
        /help
        `);
    },
};