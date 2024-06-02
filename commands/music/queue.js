const { SlashCommandBuilder } = require('discord.js');
const queue = require(process.env.MAINPATH + '/queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows current queue'),
    async execute(interaction) {
        await interaction.deferReply();
        const titleArr = [];
        for(let i = 0; i<queue.queue.length; i++) {
            const item = queue.queue[i];
            titleArr.push(i.toString() + ". " + item.title);
        }
        await interaction.editReply(`**${titleArr.join('\n')}**`);
    }
}