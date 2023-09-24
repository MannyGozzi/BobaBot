const { SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const { createAudioResource, StreamType } = require('@discordjs/voice');
const { joinVoiceChannel } = require('@discordjs/voice');
const { generateDependencyReport } = require('@discordjs/voice');
const fs = require('node:fs');
const { join } = require('path');
const ytdl = require('ytdl-core');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music from a URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL of the song you want to play')
                .setRequired(true)),
    async execute(interaction) {       
        // console.log(generateDependencyReport());

        const url = interaction.options.getString('url');

        ytdl.getInfo(url).then(info => {
            const songId = info.videoDetails.videoId;

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });

            let resource = createAudioResource(`./audio/${songId}.mp3`);
            resource = createAudioResource(`./audio/${songId}.mp3`, { inlineVolume: true });
            resource.volume.setVolume(0.5);

            ytdl(url).pipe(fs.createWriteStream(`./audio/${songId}.mp3`));

            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            connection.subscribe(player);
            player.play(resource)
        });
    },
};

function extractVideoId(url) {
    const match = url.match(/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}
