const { SlashCommandBuilder } = require('discord.js');
const pool = require('../../database');

module.exports = {
    cooldown: 10, // this is in seconds
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input')
        .addStringOption(option =>
            option
                .setName('input')
                .setDescription('text to respond with')
                .setRequired(true)),
    async execute(interaction) {
        const input = interaction.options.getString('input') ?? 'No input provided';
        const userId = interaction.user.id;

        try {
            await pool.query('INSERT INTO echos (user_id, input) VALUES ($1, $2)', [userId, input]);
            await interaction.reply(input);
        } catch(error) {
            console.error('Error inserting data', error);
            await interaction.reply('An error occurred while saving the data.')
        }

    },
};