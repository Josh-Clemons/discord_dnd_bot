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
        let name = interaction.options.getString('name');
        let query = '';
        let params;

        if(name) {
            name = name.toUpperCase();
            params = [name];
            query = `SELECT * FROM "public"."addresses" WHERE name=$1;`
        } else {
            query = `SELECT * FROM "public"."addresses";`
        }

        try {
            let response = await pool.query(query, params);
            let reply = "";

            if(response.rows.length === 0) {
                await interaction.reply({
                    content: `User not found with name: ${name}`,
                    ephemeral: true});
                return;
            }

            for(let row of response.rows) {
                reply += + `Name: ${row.name} \nAddress: ${row.address} \n\n`
            }

            await interaction.reply({content: reply, ephemeral: true})
        } catch(error) {
            console.error('Error fetching addresses', error)
            await interaction.reply({ content: "Error finding: " + error.detail, ephemeral: true })
        }
    }
}