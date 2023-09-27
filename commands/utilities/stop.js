const { SlashCommandBuilder } = require('@discordjs/builders');
const { stopSong } = require('./play.js');
const { EmbedBuilder  } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing music and clear the queue'),
    async execute(interaction) {
        await interaction.deferReply();
        await stopSong();
        const embed = new EmbedBuilder ()
                .setColor("Red")
                .setTitle("Stopping")
        await interaction.editReply({embeds: [embed]});
    }
};