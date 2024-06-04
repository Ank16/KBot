const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const queue = require(process.env.MAINPATH + '/queue');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playnext')
        .setDescription('Adds song to front of queue')
        .addStringOption(option =>
            option.setName('song')
            .setDescription('Song name')),
    async execute(interaction) {
        await interaction.deferReply();
        if(getVoiceConnection(interaction.guild.id)) {
            const song = await queue.addToFrontSearch(interaction.options.getString('song'));
            await interaction.editReply(`Added **${song}** to front of queue`);
            return;
        }

        const connection = getVoiceConnection(interaction.guild.id) || joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        const guildId = interaction.guild.id;

        connection.subscribe(player);

        await queue.addToFrontSearch(interaction.options.getString('song'), guildId);

        const nextSong = await queue.getNextFile(guildId);

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