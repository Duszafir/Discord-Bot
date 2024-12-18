const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

const TENOR_API_KEY = 'TU_API_KEY_DE_TENOR'; // Reemplaza con tu API Key de Tenor

module.exports = {
    description: 'Busca un GIF en Tenor basado en un prompt.',
    run: async (message) => {
        // Extrae los argumentos del mensaje
        const args = message.content.split(' ').slice(1).join(' ');

        // Verifica si el usuario proporcionó algún argumento
        if (args.length < 1) {
            return message.reply('Por favor, proporciona un término de búsqueda para el GIF.');
        }

        try {
            // Realiza una solicitud a la API de Tenor
            const response = await axios.get(`https://api.tenor.com/v1/search`, {
                params: {
                    q: args,
                    key: TENOR_API_KEY,
                    limit: 1 // Limita a un solo GIF
                }
            });

            // Verifica si se encontró un GIFs
            if (response.data.results.length === 0) {
                return message.reply('No se encontraron GIFs para esa búsqueda.');
            }

            // Obtiene el URL del GIF
            const gifUrl = response.data.results[0].media[0].gif.url;

            // Crea un nuevo embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`GIF para: ${args}`)
                .setImage(gifUrl)
                .setTimestamp() // Añade la fecha y hora actual
                .setFooter({ text: 'Comando: Buscar GIF' }); // Añade un pie de página si lo deseas

            // Envía el embed al canal
            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return message.reply('Ocurrió un error al buscar el GIF. Asegúrate de que tu API Key sea válida.');
        }
    }
};
