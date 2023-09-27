const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder  } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pausetoggle')
        .setDescription('toggle playback'),
    async execute(interaction) {
        // get audio player in the voice channel
        const connection = getVoiceConnection(interaction.guild.id);
        // console.log(JSON.stringify(interaction.guild, (_, v) => typeof v === 'bigint' ? v.toString() : v))
        const player = connection.state.subscription.player;

        if (!connection) {
            await interaction.reply('**Not in a voice channel**');
        } else if (player.state.status === 'paused') {
            player.unpause();
            const embed = new EmbedBuilder ()
                .setColor("Green")
                .setTitle("Resuming")
            await interaction.reply({embeds: [embed]});
        } else {
            player.pause();
            const embed = new EmbedBuilder ()
                .setColor("White")
                .setTitle("Pausing")
            await interaction.reply({embeds: [embed]});
        }
    },
};