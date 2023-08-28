const { SlashCommandBuilder } = require('discord.js');
const pool = require('../../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('save-address')
        .setDescription('Saves a users address to the database')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The name of the person who lives there')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('address')
                .setDescription('Enter the address')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        let name = interaction.options.getString('name');
        let address = interaction.options.getString('address');

        if(!name || !address) {
            await interaction.reply('Must include username and address');
            return;
        }

        try {
            await pool.query(
                `INSERT INTO addresses (name, address) VALUES ($1, $2)`,
                [name.toUpperCase(), address]
            );
            await interaction.editReply({ content: name + "'s address saved," + address });
        } catch(error) {
            console.error('Error saving address', error);
            await interaction.editReply({content: 'Error saving: ' + error.detail, ephemeral: true});
        }

    },
}