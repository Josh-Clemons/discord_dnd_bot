const schedule = require('node-schedule');
const pool = require('../database');
const {Events} = require("discord.js");

const messages = [
    "Hey ass clowns, schedule your next DND session!",
    "Do we need Geno to come back and help schedule sessions?",
    "Weekly reminder biotches, get the game on the schedule!",
    "JOE! We need you because these other lazy asses can't figure out our next session!",
    "The party is either dead or you all suck because there is no DND scheduled!",
    "You must be mowing the lawn with scissors, how about you hang out with you friends instead?",
    "The 31st of September is not a valid DND day!",
    "I AM YELLING, SCHEDULE A SESSION!!",
    "Do you remember your character's name? Me neither, get your shit scheduled!",
    "If a session isn't scheduled soon I am changing my programming to use the Aztec calendar.",
    "If I could make eye contact I would stare at you until a session is scheduled...",
    "\nSo, so you think you can tell Heaven from hell?\nBlue skies from pain?\n\n I wish you were here playing DND!",
    "I just really want to know what food you guys are going to bring... if we ever see each other again",
    "I'm going to send you chain letters if a session is not scheduled!"
]

let counter = 1;

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        // Schedule the task to run at a random day (Sunday to Saturday) between 8 AM and 8 PM
        const randomDay = Math.floor(Math.random() * 7); // 0 (Sunday) to 6 (Saturday)
        const randomHour = Math.floor(Math.random() * 13) + 8; // 8 AM to 8 PM

        schedule.scheduleJob({ dayOfWeek: randomDay, hour: randomHour }, async () => {
        // schedule.scheduleJob('*/1 * * * *', async () => {
            // checks to see if a session is scheduled before continuing
            const response = await pool.query(`SELECT * FROM sessions WHERE datetime > now()`);
            if(response.rows.length > 0 && counter !== 0) return;

            counter ++;
            const messageIndex = Math.floor(Math.random() * messages.length);
            const guildId = '1141089605588877463';
            const channelId = '1141089606306115798';
            const guild = client.guilds.cache.get(guildId);
            const channel = guild.channels.cache.get(channelId);

            if (channel) {
                channel.send(`@here ${messages[messageIndex]}`);
            }
        });
    },
};
