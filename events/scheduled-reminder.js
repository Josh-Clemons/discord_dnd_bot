const schedule = require('node-schedule');
const pool = require('../database');
const {Events} = require("discord.js");
const dayjs = require("dayjs");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        schedule.scheduleJob('0 19 * * *', async () => {
        // schedule.scheduleJob('*/1 * * * *', async () => {
            // checks to see if a session is scheduled before continuing
            const response = await pool.query(`SELECT * FROM sessions WHERE datetime > now() ORDER BY datetime ASC`);
            if(response.rows.length === 0) return;

            const session = response.rows[0];
            const now = dayjs();
            const guildId = '1141089605588877463';
            const channelId = '1141089606306115798';
            const guild = client.guilds.cache.get(guildId);
            const channel = guild.channels.cache.get(channelId);
            const formattedDate = dayjs(session.datetime).format('ddd MMM D, YYYY @ h:mm A');
            const daysUntilSession = dayjs(session.datetime).diff(now,'days')
            const message = `@here Reminder, next session: ${formattedDate}`

            if (channel) {
                if(daysUntilSession === 1 || daysUntilSession % 7 === 6) {
                    channel.send(message);
                }
            }
        });
    }
}