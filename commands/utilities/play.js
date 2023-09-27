const { SlashCommandBuilder, SelectMenuOptionBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, createAudioResource, NoSubscriberBehavior, getVoiceConnection } = require('@discordjs/voice');
const fs = require('node:fs');
const path = require('node:path');
const ytdl = require('ytdl-core');
const { audioPath } = require('../../config.json');
const queue = [];
let nextSongAvailable = false;
let lastInteraction = null;

const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music from a URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL of the song you want to play')
                .setRequired(true)),
    async execute(interaction) {       
        const url = interaction.options.getString('url');
        const songId = getVideoId(url);
        lastInteraction = interaction;
        queue.push(songId);
        player.unpause();
        interaction.deferReply();
        if (player.state.status !== 'playing') {
            await nextSong();
        }
        await interaction.editReply(`**Adding to queue\t**${await getVideoTitle(songId)}`)
    },
    async skipSong(interaction) {
        if (queue.length > 0) {
            await nextSong();
            await interaction.reply('**Skipping**')
        } else if (queue.length === 0 && player.state.status === AudioPlayerStatus.Playing) {
            queue.length = 0;
            player.stop();
            await interaction.reply('**Skipping**')
        } else {
            await interaction.reply('**Nothing to skip**')
        }
    },
    async stopSong() {
        queue.length = 0;
        player.stop();
    }
};

function getVideoId(url) {
    const match = url.match(/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

async function getVideoTitle(url) {
    const title = await ytdl.getInfo(url).then(info => info.videoDetails.title);
    return title
}

async function nextSong() {
    clearDownloadedSongs();
    const url = queue.shift();
    ytdl.getInfo(url).then(info => {
        const songId = info.videoDetails.title;
        // start downloading then reference the resource
        ytdl(url).pipe(fs.createWriteStream(`./audio/${songId}.mp3`)).on('finish', () => {

            const resource = createAudioResource(`./audio/${songId}.mp3`, { inlineVolume: true });
            resource.volume.setVolume(0.5);

            const connection = joinVoiceChannel({
                channelId: lastInteraction.member.voice.channel.id,
                guildId: lastInteraction.guild.id,
                adapterCreator: lastInteraction.guild.voiceAdapterCreator,
            });

            connection.subscribe(player);
            player.play(resource);
            lastInteraction.followUp({ content: `**Now playing**\t\t\t${songId}`, ephemeral: false });
            nextSongAvailable = queue.length !== 0
        });
    }).catch(err => {
        console.log(err);
        lastInteraction.followUp({ content: `**Error retrieving video: **\t\t\t${err}`, ephemeral: true });
    });
}

player.on(AudioPlayerStatus.Idle, () => {
    if (player.state.status === AudioPlayerStatus.Idle && queue.length > 0 && lastInteraction) {
        nextSong();
    } else if(lastInteraction && !nextSongAvailable) {
        lastInteraction.followUp({ content: '**Queue empty**', ephemeral: true });
    }
})


function clearDownloadedSongs() {
    fs.readdir(audioPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }
      files.forEach(file => {
        const filePath = path.join(audioPath, file);
        fs.unlink(filePath, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    });
}