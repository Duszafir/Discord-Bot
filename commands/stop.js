const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

let isPlaying = false; // Variable global para saber si hay una canción en reproducción

module.exports = {
    description: 'Comando: Play, reproduce una canción.',
    play: async (message, client, song) => {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            const embedNoChannel = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('¡Necesitas estar en un canal de voz para reproducir música!')
                .setTimestamp();
            return message.reply({ embeds: [embedNoChannel] });
        }

        // Conectar al canal de voz y reproducir la canción
        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            // Aquí deberías tener tu lógica de reproducción de la canción
            // Por ejemplo: client.player.play(song);

            isPlaying = true; // Marca que se está reproduciendo una canción
            const embedPlaying = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Reproducción Iniciada')
                .setDescription(`Reproduciendo: **${song.title}**`)
                .setTimestamp();

            message.reply({ embeds: [embedPlaying] });

        } catch (error) {
            const embedError = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('Ocurrió un error al intentar reproducir la canción.')
                .setTimestamp();
            message.reply({ embeds: [embedError] });
        }
    },

    stop: async (message, client) => {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            const embedNoChannel = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('¡Necesitas estar en un canal de voz para usar este comando!')
                .setTimestamp();
            return message.reply({ embeds: [embedNoChannel] });
        }

        if (!isPlaying) {
            const embedNotPlaying = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('No hay ninguna canción reproduciéndose actualmente.')
                .setTimestamp();
            return message.reply({ embeds: [embedNotPlaying] });
        }

        try {
            client.player.stop(); // Detener el reproductor de audio
            isPlaying = false; // Actualizar el estado

            const embedStopped = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Reproducción Detenida')
                .setDescription('La reproducción de audio ha sido detenida.')
                .setTimestamp();

            message.reply({ embeds: [embedStopped] });

        } catch (error) {
            const embedError = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('Ocurrió un error al intentar detener la reproducción.')
                .setTimestamp();
            message.reply({ embeds: [embedError] });
        }
    }
};