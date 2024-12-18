const { EmbedBuilder } = require('discord.js');

module.exports = {
    description: 'Comando: Say, repite.',
    run: async (message) => {
        // Extrae los argumentos del mensaje
        const args = message.content.split(' ').slice(1).join(' ');

        // Verifica si el usuario proporcionó algún argumento
        if (args.length < 1) {
            return message.reply('Completa el comando');
        }

        // Crea un nuevo embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Puedes cambiar el color
            .setTitle(`${message.author.username}`)
            .setDescription(`${args}`)
            .setTimestamp() // Añade la fecha y hora actual
            .setFooter({ text: 'Comando Say' }); // Añade un pie de página si lo deseas

        // Envía el embed al canal
        message.reply({ embeds: [embed] });
    }
};
    