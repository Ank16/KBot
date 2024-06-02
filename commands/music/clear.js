const { SlashCommandBuilder } = require('discord.js');
const queue = require(process.env.MAINPATH + '/queue');
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the queue'),
    async execute(interaction) {
        await interaction.deferReply();
        queue.queue = [];
        await interaction.editReply("Cleared the queue");

        fs.readdir(path.join(process.env.MAINPATH, interaction.guild.id), (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
                if(file=='playing.mp3') continue;
                fs.unlink(path.join(process.env.MAINPATH, interaction.guild.id, file), (err) => {
                    if (err) throw err;
                });
            }
        });
    }
}