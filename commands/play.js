const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const { PassThrough } = require('stream');
const { exec } = require('child_process');

// Variable global para saber si hay una canción en reproducción
let isPlaying = false;

module.exports = {
    description: 'Comando: Play, reproduce audio de YouTube.',
    run: async (message, apiUrl, apiKey, cooldowns, client) => {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            const embedNoChannel = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('¡Necesitas estar en un canal de voz para usar este comando!')
                .setTimestamp();
            return message.reply({ embeds: [embedNoChannel] });
        }

        const args = message.content.split(' ').slice(1).join(' ');

        if (!args) {
            const embedNoLink = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('¡Debes proporcionar un enlace de YouTube!')
                .setTimestamp();
            return message.reply({ embeds: [embedNoLink] });
        }

        // Verificar si ya hay una canción en reproducción
        if (isPlaying) {
            const embedAlreadyPlaying = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('Ya hay una canción en reproducción. Por favor, espera a que termine para reproducir otra.')
                .setTimestamp();
            return message.reply({ embeds: [embedAlreadyPlaying] });
        }

        try {
            // Verificar si el bot ya está conectado a un canal de voz
            if (!client.connection) {
                // Conectar al canal de voz
                client.connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });

                // Crear un reproductor de audio
                client.player = createAudioPlayer();
            }

            // Ejecutar yt-dlp para obtener el stream de audio
            const stream = new PassThrough();
            exec(`yt-dlp -f bestaudio --quiet --no-warnings --output - ${args}`, { encoding: 'buffer' })
                .stdout.pipe(stream);

            // Crear un recurso de audio a partir del stream
            const resource = createAudioResource(stream, {
                inputType: StreamType.Arbitrary,
            });

            // Marcar que se está reproduciendo una canción
            isPlaying = true;

            client.player.play(resource);

            // Manejar el evento cuando el audio termina
            client.player.on(AudioPlayerStatus.Idle, () => {
                // Restablecer el estado de reproducción a false cuando termine la canción
                isPlaying = false;
                console.log('Canción terminada, el bot sigue en el canal.');
            });

            // Enviar el reproductor al canal de voz
            client.connection.subscribe(client.player);

            // Crear un embed para confirmar la reproducción
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(':yt: Reproducción de YouTube')
                .setDescription(`Reproduciendo desde el enlace de YouTube: ${args}`)
                .setTimestamp()
                .setFooter({ text: 'Comando Play' });

            message.reply({ embeds: [embed] });

        } catch (error) {
            const embedError = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('Ocurrió un error al intentar reproducir el audio.')
                .setTimestamp();
            message.reply({ embeds: [embedError] });

            // Restablecer el estado de reproducción si hay un error
            isPlaying = false;
        }
    }
};
