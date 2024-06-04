const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const queue = require(process.env.MAINPATH + '/queue');
const fs = require('node:fs');
const path = require('node:path');
const play = require('./play');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips to next song in queue'),
    async execute(interaction) {
        await interaction.deferReply();

        const connection = getVoiceConnection(interaction.guild.id);
        
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        connection.subscribe(player);

        const guildId = interaction.guild.id;

        const nextSong = await queue.getNextFile(guildId);

        if(!nextSong) {
            player.stop();
            connection.destroy();
            await interaction.editReply("**Finished playing**");
            fs.rmSync(path.join(process.env.MAINPATH, guildId), { recursive: true });
            return;
        }

        await interaction.editReply("Now Playing: " + `**${nextSong.title}**`);

        const channel = interaction.channel;
        
        player.play(createAudioResource(path.join(process.env.MAINPATH, guildId, 'playing.mp3')));
        
        player.on('error', error => {
            console.error(error);
        });
        
        player.on(AudioPlayerStatus.Idle, async () => {
            const newSong = await queue.getNextFile(guildId);
            if(!newSong) {
                player.stop();
                connection.disconnect();
                connection.destroy();
                fs.rmSync(path.join(process.env.MAINPATH, guildId), { recursive: true });
                return;
            }
            channel.send("Now Playing: " + `**${newSong.title}**`);
            player.play(createAudioResource(path.join(process.env.MAINPATH, guildId, 'playing.mp3')));
        });
    }
}