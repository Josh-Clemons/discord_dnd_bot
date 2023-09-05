const { SlashCommandBuilder } = require('discord.js');
const glob = require('glob');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('reloads a command')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('the command to reload')
                .setRequired(true)
        ),
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply({content: `No command with name \`${commandName}\`!`,
                ephemeral: true});
        }

        const targetCommandName = command.data.name;
        const targetCommandFolderPath = `${__dirname}/../../commands/**/${targetCommandName}.js`;
        const commandFilePaths = glob.sync(targetCommandFolderPath);

        if (commandFilePaths.length === 0) {
            return interaction.reply(`Could not find command \`${targetCommandName}\`.`);
        }
        const targetCommandFilePath = commandFilePaths[0];

        try {
            interaction.client.commands.delete(command.data.name);
            delete require.cache[require.resolve(targetCommandFilePath)];
            const newCommand = require(targetCommandFilePath);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply({content: `Command \`${newCommand.data.name}\` was reloaded!`, ephemeral: true});
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `There was an error while reloading command \`${command.data.name}\` :\n\`${error.message}\``,
                ephemeral: true});
        }
    }
}