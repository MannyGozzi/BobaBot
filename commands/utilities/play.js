const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, createAudioResource, NoSubscriberBehavior, getVoiceConnection } = require('@discordjs/voice');
const fs = require('node:fs');
const path = require('node:path');
const ytdl = require('ytdl-core');
const { audioPath } = require('../../config.json');
const { get } = require('node:http');
const queue = [];
let nextSongAvailable = false;
let lastInteraction = null;
const { BUTTON_PREFIX } = require('../../constants.js');

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
        interaction.deferReply();
        player.unpause();
        const videoTitle = await getVideoTitle(songId);
        if (!videoTitle) {
            const embedError = new EmbedBuilder ()
            .setColor("Red")
            .setTitle("Failed to add to queue")
            .setDescription("This usually happens with age restricted content")
            await interaction.editReply({embeds: [embedError]});
            return;
        }
        queue.push(songId);
        if (player.state.status !== 'playing') {
            await nextSong();
        }
        //const songDetails = await getVideoAttributes(songId);
        const embed = new EmbedBuilder ()
            .setColor("White")
            .setTitle("Adding to queue")
            .setDescription(videoTitle)
        await interaction.editReply({embeds: [embed], components: [getPlayerControls()]});
    },
    async skipSong(interaction) {
        if (queue.length > 0) {
            await nextSong();
            const embed = new EmbedBuilder ()
                .setColor("White")
                .setTitle("Skipping")
            await interaction.reply({embeds: [embed]});
        } else if (queue.length === 0 && player.state.status === AudioPlayerStatus.Playing) {
            queue.length = 0;
            player.stop();
            const embed = new EmbedBuilder ()
                .setColor("White")
                .setTitle("Skipping")
            await interaction.reply({embeds: [embed]});
        } else {
            const embed = new EmbedBuilder ()
                .setColor("Red")
                .setTitle("Nothing to skip")
            await interaction.reply({embeds: [embed]});
        }
    },
    async stopSong() {
        queue.length = 0;
        player.stop();
    }
};

function getVideoId(url) {
    try {
        const match = url.match(/([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    } catch (err) {
        console.error('Error parsing video id:', err.message);
        return null;
    }
}

async function getVideoTitle(url) {
    try {
        const info = await ytdl.getInfo(url);
        return info.videoDetails.title;
    } catch (err) {
        console.error('Error getting video title:', err.message);
        return "";
    }
    return "";
}

// async function getVideoAttributes(url) {
//     try {
//         const info = await ytdl.getInfo(url);
//         return info.videoDetails;
//     } catch (err) {
//         console.error('Error getting video attributes:', err.message);
//         return null;
//     }
// }

async function nextSong() {
    clearDownloadedSongs();
    const url = queue.shift();
    const songId = await getVideoTitle(url);
    
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
        const embed = new EmbedBuilder ()
            .setColor("White")
            .setTitle("Now Playing")
            .setDescription(songId);
        lastInteraction.channel.send({embeds: [embed]});
        nextSongAvailable = queue.length !== 0
    });
}

player.on(AudioPlayerStatus.Idle, () => {
    if (player.state.status === AudioPlayerStatus.Idle && queue.length > 0 && lastInteraction) {
        nextSong();
    } else if(lastInteraction && !nextSongAvailable) {
        const embed = new EmbedBuilder ()
            .setColor("Red")
            .setTitle("Queue Empty")
        lastInteraction.channel.send({embeds: [embed]});
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

function getPlayerControls() {
    const pauseToggleButton = new ButtonBuilder()
            .setCustomId(`${BUTTON_PREFIX}pause`)
            .setLabel('⏸')
            .setStyle('Primary');
    const stopButton = new ButtonBuilder()
        .setCustomId(`${BUTTON_PREFIX}stop`)
        .setLabel('⏹')
        .setStyle('Primary');
    const skipButton = new ButtonBuilder()
        .setCustomId(`${BUTTON_PREFIX}skip`)
        .setLabel('⏵')
        .setStyle('Primary');
    const row = new ActionRowBuilder()
        .addComponents(stopButton, pauseToggleButton, skipButton);
    return row
}