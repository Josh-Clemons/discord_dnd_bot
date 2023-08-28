const { SlashCommandBuilder } = require('discord.js');
const pool = require('../../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-address')
        .setDescription('Updates a user\'s address in the database')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The updated name of the person who lives there'))
        .addStringOption(option =>
            option
                .setName('address')
                .setDescription('The updated address')),
    async execute(interaction) {
        await interaction.deferReply();
        const name = interaction.options.getString('name');
        const newAddress = interaction.options.getString('address');

        if (!name && !newAddress) {
            await interaction.reply('Must include name and address');
            return;
        }

        try {
            const existingAddress = await pool.query(
                'SELECT * FROM addresses WHERE name = $1',
                [name.toUpperCase()]
            );

            if (existingAddress.rows.length === 0) {
                await interaction.editReply({ content: 'Address not found', ephemeral: true });
                return;
            }

            const currentAddress = existingAddress.rows[0].address;

            const updatedAddress = newAddress || currentAddress;

            await pool.query(
                'UPDATE addresses SET address = $2 WHERE name = $1',
                [name.toUpperCase(), updatedAddress]
            );

            await interaction.editReply({ content: `${name}'s address updated, ${updatedAddress}` });
        } catch (error) {
            console.error('Error updating address', error);
            await interaction.editReply({ content: 'Error updating: ' + error.detail, ephemeral: true });
        }
    },
};
