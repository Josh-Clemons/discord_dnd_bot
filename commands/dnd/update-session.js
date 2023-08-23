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
        .setName('update-session')
        .setDescription('Updates a session')
        .addIntegerOption(option =>
            option
                .setName('session_id')
                .setDescription('ID of the session to update')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('date')
                .setDescription('New date of the session (YYYY-MM-DD)')
        )
        .addStringOption(option =>
            option
                .setName('time')
                .setDescription('New start time (HH:mm)')
        )
        .addStringOption(option =>
            option
                .setName('location')
                .setDescription('New hosting location')
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const sessionId = interaction.options.getInteger('session_id');
        const newDate = interaction.options.getString('date');
        const newTime = interaction.options.getString('time');
        const newLocation = interaction.options.getString('location');

        try {
            const sessionResponse = await pool.query(
                'SELECT * FROM sessions WHERE id = $1',
                [sessionId]
            );

            if (sessionResponse.rows.length === 0) {
                await interaction.editReply({ content: 'Session not found', ephemeral: true });
                return;
            }

            const session = sessionResponse.rows[0];
            const currentDateTime = dayjs(session.datetime);

            let updatedDateTime = currentDateTime;
            if (newDate || newTime) {
                const newDateTimeString = `${newDate || currentDateTime.format('YYYY-MM-DD')} ${newTime || currentDateTime.format('HH:mm')}`;
                updatedDateTime = dayjs.tz(newDateTimeString, 'America/Chicago');
                console.log(updatedDateTime);
            }

            const formattedUpdatedDateTimeString = updatedDateTime.tz('America/Chicago').format('YYYY-MM-DD HH:mm:ss z');

            const updatedLocation = newLocation || session.location;

            await pool.query(
                'UPDATE sessions SET datetime = $1, location = $2 WHERE id = $3',
                [formattedUpdatedDateTimeString, updatedLocation, sessionId]
            );

            await interaction.editReply({ content: `Session saved! ${updatedDateTime} @ ${updatedLocation}'s`});
        } catch (error) {
            console.error('Error updating session:', error);
            await interaction.editReply({ content: 'Error updating session' + error.detail, ephemeral: true });
        }
    }
};
