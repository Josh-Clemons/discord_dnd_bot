const { SlashCommandBuilder } = require('discord.js');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const timezone = require('dayjs/plugin/timezone'); // Import the timezone plugin
const utc = require('dayjs/plugin/utc'); // Import the utc plugin
const pool = require('../../database');

dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(utc);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('new-session')
        .setDescription('Saves a session')
        .addStringOption(option  =>
            option
                .setName('date')
                .setDescription('The date of the session (YYYY-MM-DD)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('time')
                .setDescription('Start time (HH:mm), 24-hour clock')
        )
        .addStringOption(option =>
            option
                .setName('location')
                .setDescription('Who is hosting?')
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const date = interaction.options.getString('date');
        const time = interaction.options.getString('time') ?? '00:00';
        const location = interaction.options.getString('location') ?? 'Not set';

        try {
            const dateTimeString = `${date} ${time}`;
            const formattedDateTime = dayjs.tz(dateTimeString, 'America/Chicago');
            const formattedDateTimeString = formattedDateTime.tz('America/Chicago').format('YYYY-MM-DD HH:mm:ss');

            await pool.query(
                `INSERT INTO sessions (datetime, location) VALUES ($1, $2)`,
                [formattedDateTimeString, location]
            );
            await interaction.editReply({ content: `Session saved! ${formattedDateTime} @ ${location}'s`});
        } catch(error) {
            console.error('Error saving session:', error);
            await interaction.editReply({ content: 'Error saving session' + error.detail, ephemeral: true})
        }
    }
}