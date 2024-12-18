const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    description: 'Comando: Extrae el DNI de la página de Dateas.',
    run: async (message) => {
        // Obtiene el argumento después del comando
        const args = message.content.split(' ').slice(1).join(' ');

        if (args.length < 1) {
            return message.reply('Por favor, proporciona el nombre a buscar.');
        }

        // Construir la URL con el argumento
        const url = `https://www.dateas.com/es/persona/${encodeURIComponent(args)}`;

        try {
            // Hacer la solicitud con el encabezado User-Agent
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
                }
            });

            // Aquí puedes extraer el DNI del contenido de la página
            const pageData = response.data;

            // Busca y extrae el DNI de pageData (esto depende de cómo esté estructurada la página)
            const dni = extractDNIFromPage(pageData); // Esta función la tienes que definir según cómo esté estructurado el HTML

            // Si no se encuentra el DNI
            if (!dni) {
                return message.reply('No se pudo encontrar el DNI.');
            }

            // Crear el embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`DNI para ${args}`)
                .setDescription(`DNI extraído: ${dni}`)
                .setTimestamp()
                .setFooter({ text: 'Comando DNI' });

            // Enviar el embed como respuesta
            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error al obtener el DNI:', error);
            message.reply('Hubo un error al intentar obtener el DNI.');
        }
    }
};

// Función que extrae el DNI del contenido de la página (esto depende de la estructura de Dateas)
function extractDNIFromPage(pageData) {
    // Aquí podrías usar expresiones regulares o manipulación de strings para extraer el DNI.
    // Por ejemplo, si el DNI está en algún formato particular en la página:
    const dniRegex = /DNI:\s*(\d+)/; // Esto es un ejemplo, puede variar dependiendo de la estructura
    const match = pageData.match(dniRegex);
    return match ? match[1] : null;
}
