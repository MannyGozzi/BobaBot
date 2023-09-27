const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);
        const player = connection.state.subscription.player;
        if (player.state.status === 'paused') {
            player.unpause();
        } else {
            player.pause();
        }
        interaction.deferUpdate();
    },
};