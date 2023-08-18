const { SlashCommandBuilder } = require('discord.js');
const pool = require('../../database');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upcoming-session')
        .setDescription('Gets session details')
        .addBooleanOption(option =>
            option
                .setName('all')
                .setDescription('Return all sessions?')
        ),
    async execute(interaction) {
        let all = interaction.options.getBoolean('all') ?? false;
        let query = '';

        if(all) {
            query = `SELECT * FROM sessions;`
        } else {
            query = `
                SELECT * 
                FROM sessions 
                WHERE datetime > now() 
                ORDER BY datetime ASC 
                LIMIT 1;
            `;        }

        try {
            let response = await pool.query(query);
            let reply = '';
            if(response.rows.length === 0) {
                await interaction.reply({ content: 'No sessions found', ephemeral: true});
                return;
            }

            for(let row of response.rows) {
                const formattedDate = dayjs(row.datetime).format('ddd MMM D, YYYY @ h:mm A');
                reply += `Date: ${formattedDate} \nLocation: ${row.location}\nid:${row.id}\n\n`;
            }

            await interaction.reply({ content: reply });
        } catch(error) {
            console.error('Error fetching session(s):', error);
            await interaction.reply({ content: 'Error fetching session(s):' + error.detail, ephemeral: true});
        }

    }
}