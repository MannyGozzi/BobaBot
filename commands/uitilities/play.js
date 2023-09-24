const { SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

const { createReadStream } = require('node:fs');
const { join } = require('node:path');
const { createAudioResource, StreamType } = require('@discordjs/voice');
var YoutubeMp3Downloader = require("youtube-mp3-downloader");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('show all commands')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The url of the song you want to play')
                .setRequired(true)),
    async execute(interaction) {
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const url = interaction.options.getString('url');
        var match = url.match(regExp);
        const songId = (match&&match[7].length==11) ? match[7] : '';
        console.log(songId);

        //Configure YoutubeMp3Downloader with your settings
        var YD = new YoutubeMp3Downloader({
            "ffmpegPath": "C:/dev/apps/ffmpeg/bin", // FFmpeg binary location
            "outputPath": "/audio/",                // Output file location (default: the home directory)
            "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
            "queueParallelism": 2,                  // Download parallelism (default: 1)
            "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
            "allowWebm": false                      // Enable download from WebM sources (default: false)
        });

        YD.download(songId);

        YD.on("finished", function(err, data) {
            console.log(JSON.stringify(data));
            player.play(data);

        });

        YD.on("error", function(error) {
            console.log(error);
        });

        YD.on("progress", function(progress) {
            console.log(JSON.stringify(progress));
        });
         interaction.reply('Playing song');
   
        // Inline volume is opt-in to improve performance
        let resource = createAudioResource(join(__dirname, 'file.mp3'));

        // Will use FFmpeg with volume control enabled
        resource = createAudioResource(join(__dirname, 'file.mp3'), { inlineVolume: true });
        resource.volume.setVolume(0.5);

    },
};