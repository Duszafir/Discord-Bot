const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');
require('dotenv').config()

// Configuración del cliente de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates // Este intent es necesario para rastrear cambios en los estados de voz
    ]
});

// Almacenamiento de cooldowns para los usuarios
const cooldowns = new Map();

// Añadir propiedades globales para la conexión y el reproductor
client.connection = null;
client.player = null;

// Evento cuando el cliente está listo
client.once(Events.ClientReady, () => {
    console.log(`Conectado como ${client.user.username}!`);
});

// Evento cuando se recibe un mensaje
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).split(' ');
    const commandName = args.shift().toLowerCase();  // Obtener el nombre del comando

    try {
        const commandPath = path.resolve(__dirname, `./commands/${commandName}.js`);
        const command = require(commandPath);
        await command.run(message, process.env.API_URL, process.env.API_KEY, cooldowns, client);
    } catch (error) {
        console.error(`Error al utilizar el comando ${commandName}:`, error.message);
    }
});

// Evento que se ejecuta cuando hay cambios en los estados de voz
client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    // Verificar si el bot estaba en un canal de voz y ha sido desconectado
    if (oldState.member.id === client.user.id && oldState.channelId && !newState.channelId) {
        // El bot fue desconectado de un canal de voz
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Desconexión del canal de voz')
            .setDescription('Fui kickeado del canal de voz.')
            .setTimestamp();

        // Enviar el embed en el canal donde ocurrió la desconexión
        const textChannel = oldState.guild.channels.cache.find(channel => channel.type === 0); // Encuentra un canal de texto
        if (textChannel) {
            textChannel.send({ embeds: [embed] });
        }

        // Limpiar las variables del bot
        client.connection = null;
        client.player = null;
    }
});

// Iniciar sesión en Discord
client.login(process.env.DISCORD_TOKEN);
