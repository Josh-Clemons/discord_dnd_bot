const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Returns a list of commands'),
    async execute(interaction) {
        const commandResponse = `
            |
            | Command, followed by options (* indicates required)
            |---------------------------------------------------------------------------
            | \`/upcoming-session\` : Returns the next session coming up.
            |             - \`all\`: True returns all upcoming, false just the next
            |---------------------------------------------------------------------------
            | \`/new-session\` : Create a new session.
            |             - \`date*\`: Date formatted YYYY-MM-DD.
            |             - \`time\`: 24-hour formatted as HH:mm.
            |             - \`host\`: The person hosting.
            |---------------------------------------------------------------------------
            | \`/update-session\` : Updates a session by session ID.
            |             - \`session id*\`: Session ID (use \`/upcoming-session\` to find)
            |             - \`date\`: Date formatted YYYY-MM-DD.
            |             - \`time\`: 24-hour formatted as HH:mm.
            |             - \`host\`: The person hosting.
            |---------------------------------------------------------------------------
            | \`/get-address\` : Get one or all addresses.
            |             - \`name\`: Name of the person.
            |---------------------------------------------------------------------------
            | \`/save-address\` : Saves a new address record.
            |             - \`name*\`: Name of the person who lives there.
            |             - \`address*\`: Address of the person.
            |---------------------------------------------------------------------------
            | \`/update-address\` : Updates a person's address.
            |             - \`name*\`: person's address to update.
            |             - \`address*\`: The new address.
            `;

        await interaction.reply({ content: commandResponse, ephemeral: true });
    },
};
