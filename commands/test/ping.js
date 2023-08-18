const { SlashCommandBuilder } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;

module.exports = {
    cooldown: 10, // this is in seconds
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with fuck your face'),
    async execute(interaction) {
        // await interaction.reply('pong bitch!');
        await interaction.deferReply(); // this sends a message that the bot is thinking, discord requires a response within 3 seconds or it fails
        await interaction.editReply('edited')
        await interaction.deleteReply();
        await wait(3000);
        await interaction.followUp({ content: 'follow up message', ephemeral: true});
        // const message = await interaction.fetchReply();
        // console.log(message);
    },
};