const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    description: 'Obtiene todos los links de una página web y permite la navegación entre ellos.',
    run: async (message) => {
        const url = message.content.split(' ').slice(1).join(' ');

        if (!url) {
            return message.reply('Por favor, proporciona una URL.');
        }

        try {
            const response = await axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);

            const links = [];
            $('a').each((i, link) => {
                const href = $(link).attr('href');
                if (href) {
                    links.push(href);
                }
            });

            if (links.length === 0) {
                return message.reply('No se encontraron enlaces en esta página.');
            }

            const MAX_LENGTH = 1024; // Limitar a 1024 caracteres para más control en los embeds

            function splitText(text, maxLength) {
                const chunks = [];
                while (text.length > maxLength) {
                    let chunk = text.slice(0, maxLength);
                    const lastNewline = chunk.lastIndexOf('\n');
                    if (lastNewline !== -1) {
                        chunk = chunk.slice(0, lastNewline + 1);
                    }
                    chunks.push(chunk);
                    text = text.slice(chunk.length);
                }
                chunks.push(text);
                return chunks;
            }

            const linksText = links.join('\n');
            const descriptionChunks = splitText(linksText, MAX_LENGTH);
            let currentIndex = 0;

            const createEmbed = (index) => {
                return new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`Enlaces encontrados (Página ${index + 1} de ${descriptionChunks.length})`)
                    .setDescription(descriptionChunks[index])
                    .setTimestamp()
                    .setFooter({ text: `Página ${index + 1} / ${descriptionChunks.length}` });
            };

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('⬅️ Anterior')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentIndex === 0), // Deshabilitar si es la primera página
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('➡️ Siguiente')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentIndex === descriptionChunks.length - 1) // Deshabilitar si es la última página
                );

            const embedMessage = await message.reply({ embeds: [createEmbed(currentIndex)], components: [row] });

            const filter = (interaction) => interaction.user.id === message.author.id;

            const collector = embedMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (interaction) => {
                try {
                    if (interaction.customId === 'next') {
                        if (currentIndex < descriptionChunks.length - 1) {
                            currentIndex++;
                            await interaction.update({ embeds: [createEmbed(currentIndex)], components: [row] });
                        } else {
                            const response = await interaction.reply({ content: '¡Ya estás en la última página!', ephemeral: true });
                            setTimeout(() => response.delete().catch(console.error), 3000);
                        }
                    } else if (interaction.customId === 'prev') {
                        if (currentIndex > 0) {
                            currentIndex--;
                            await interaction.update({ embeds: [createEmbed(currentIndex)], components: [row] });
                        } else {
                            const response = await interaction.reply({ content: '¡Ya estás en la primera página!', ephemeral: true });
                            setTimeout(() => response.delete().catch(console.error), 3000);
                        }
                    }

                    // Actualiza el estado de los botones
                    row.components[0].setDisabled(currentIndex === 0); // Deshabilitar botón anterior si es la primera página
                    row.components[1].setDisabled(currentIndex === descriptionChunks.length - 1); // Deshabilitar botón siguiente si es la última página
                    await interaction.update({ components: [row] });
                } catch (err) {
                    console.error('Error al manejar la interacción:', err);
                }
            });

            collector.on('end', () => {
                row.components.forEach(button => button.setDisabled(true)); // Deshabilitar todos los botones
                embedMessage.edit({ components: [row] });
            });

        } catch (error) {
            console.error(error);
            return message.reply('Ocurrió un error al intentar obtener los enlaces.');
        }
    }
};
