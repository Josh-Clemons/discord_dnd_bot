const { SlashCommandBuilder } = require('discord.js');
const pool = require('../../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-address')
        .setDescription('Gets user address')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of person, if left empty all addresses are returned')
        ),
    async execute(interaction) {
        await interaction.deferReply();
        let name = interaction.options.getString('name');
        let query = '';
        let params;

        if(name) {
            params = [name.toUpperCase()];
            query = `SELECT * FROM "public"."addresses" WHERE name=$1;`
        } else {
            query = `SELECT * FROM "public"."addresses" ORDER BY name ASC;`
        }

        try {
            let response = await pool.query(query, params);
            let reply = "";

            if(response.rows.length === 0) {
                await interaction.editReply({
                    content: `User not found with name: ${name}`,
                    ephemeral: true});
                return;
            }
            for(let row of response.rows) {
                if(name === null) {
                    reply = reply + `Name: ${row.name} \nAddress: ${row.address}\n\n`
                } else {
                    reply = reply + `Name: ${name} \nAddress: ${row.address}\n\n`
                }
            }

            await interaction.editReply({content: reply, ephemeral: true})
        } catch(error) {
            console.error('Error fetching addresses', error)
            await interaction.editReply({ content: "Error finding: " + error.detail, ephemeral: true })
        }
    }
}