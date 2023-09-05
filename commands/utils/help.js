const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Returns a list of commands'),
    async execute(interaction) {
        const commandResponse = `
    Command List (followed by options):
    ----------------------------
    \`/upcoming-session\` : Returns the next session.
        \`all\`: Returns all upcoming sessions.
    ----------------------------
    \`/new-session\` : Create a new session.
        \`date*\`: Date (YYYY-MM-DD).
        \`time\`: Time (24-hour, HH:mm).
        \`host\`: Host's name.
    ----------------------------
    \`/update-session\` : Updates a session by ID.
        \`session id*\`: ID (use \`/upcoming-session\` to find).
        \`date\`: New date (YYYY-MM-DD).
        \`time\`: New time (24-hour, HH:mm).
        \`host\`: New host's name.
    ----------------------------
    \`/get-address\` : Get one or all addresses.
        \`name\`: Person's name.
    ----------------------------
    \`/save-address\` : Saves a new address.
        \`name*\`: Person's name.
        \`address*\`: Person's address.
    ----------------------------
    \`/update-address\` : Updates a person's address.
        \`name*\`: Person's name.
        \`address*\`: New address.
`;

        await interaction.reply({ content: commandResponse, ephemeral: true });
    },
};
