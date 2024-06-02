const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const path = require('node:path');
const fs = require('node:fs');
const queue = require(process.env.MAINPATH + '/queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops and disconnects player'),
    async execute(interaction) {
        await interaction.deferReply();

        queue.queue = [];

        const guildId = interaction.guild.id;

        const connection = getVoiceConnection(guildId);

        if(connection){
            connection.disconnect();
            connection.destroy();
            await interaction.editReply(`**Stopped playing and disconnected**`);
        }else {
            await interaction.editReply(`**Not connected**`);
        }

        fs.readdir(path.join(process.env.MAINPATH, guildId), (err, files) => {
          if (err) throw err;
        
          for (const file of files) {
              if(file=='playing.mp3') continue;
              fs.unlink(path.join(process.env.MAINPATH, guildId, file), (err) => {
                  if (err) throw err;
              });
          }
      });       
    }
}