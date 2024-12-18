module.exports = {
    description: 'Comando: Disconnect, desconecta al bot del canal de voz.',
    run: async (message, apiUrl, apiKey, cooldowns, client) => {
        if (client.connection) {
            client.connection.destroy();
            client.connection = null;
            message.reply('El bot ha sido desconectado del canal de voz.');
        } else {
            message.reply('El bot no está conectado a ningún canal de voz.');
        }
    }
};
