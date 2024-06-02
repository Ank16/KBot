const { SlashCommandBuilder } = require('discord.js');
const queue = require(process.env.MAINPATH + '/queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles queue'),
    async execute(interaction) {
        await interaction.deferReply();
        queue.shuffle();
        const titleArr = [];
        for(let i = 0; i<queue.queue.length; i++) {
            const item = queue.queue[i];
            titleArr.push(i.toString() + ". " + item.title);
        }
        await interaction.editReply(`**Shuffled queue:\n${titleArr.join('\n')}**`);

    }
}