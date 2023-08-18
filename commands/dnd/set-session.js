const { SlashCommandBuilder } = require('discord.js');
const dayjs = require('dayjs');
const pool = require('../../database');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-session')
        .setDescription('Saves a session')
        // for the below option, I would like to use day.js to save the date and time of the next session. How do I configure it so the user can enter a date and the code is able to handle it appropriately?
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
        const date = interaction.options.getString('date');
        const time = interaction.options.getString('time') ?? '00:00';
        const location = interaction.options.getString('location') ?? 'Not set';

        try {
            const dateTimeString = `${date} ${time}`;
            const formattedDateTime = dayjs(dateTimeString, `YYYY-MM-DD HH:mm`);
            const formattedDateTimeString = formattedDateTime.format('YYYY-MM-DD HH:mm:ss');

            await pool.query(
                `INSERT INTO sessions (datetime, location) VALUES ($1, $2)`,
                [formattedDateTimeString, location]
            );
            await interaction.reply({ content: "Session saved!", ephemeral: true});
        } catch(error) {
            console.error('Error saving session:', error);
            await interaction.reply({ content: 'Error saving session' + error.detail, ephemeral: true})
        }
    }
}