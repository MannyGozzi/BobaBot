const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const fs = require('node:fs');
const path = require('node:path');
const { downloadPath } = require('./config.json');
const ytdl = require('ytdl-core');
const queue = [];
let lastInteraction = null;
let playing = false;

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
        const songId = extractVideoId(url);
        lastInteraction = interaction;
        queue.push(songId);
        interaction.deferReply();
        if (!playing) {
            await nextSong();
            playing = true;
        }
        await interaction.editReply(`**Adding to queue\t**${await getVideoId(songId)}`)
    },
};

function extractVideoId(url) {
    const match = url.match(/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

async function getVideoId(url) {
    const title = await ytdl.getInfo(url).then(info => info.videoDetails.title);
    return title
}

async function nextSong() {
    await clearDownloadedSongs();
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
            lastInteraction.followUp({ content: `**Now playing**\t\t${songId}`, ephemeral: false });
        });
    });
}

player.on(AudioPlayerStatus.Idle, () => {
    playing = false;
    if (queue.length > 0 && lastInteraction) {
        playing = true;
        nextSong();
    } else if(lastInteraction && playing === false) {
        playing = false;
        lastInteraction.followUp({ content: '**Queue empty**', ephemeral: true });
    }
})


async function clearDownloadedSongs() {
    for (const file of await fs.readdir(directory)) {
        await fs.unlink(path.join(directory, file));
    }
}