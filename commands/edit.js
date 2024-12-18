const { Message } = require("discord.js");

module.exports = {
    description: 'Comando: Editar el último mensaje enviado por el bot.',
    run: async (message) => {
        const requiredRoleID = '1272329716279414908';
        const hasRole = message.member.roles.cache.has(requiredRoleID);

        if (!hasRole) {
            return message.reply('No tienes permiso para usar este comando.');
        }

        const args = message.content.split(' ').slice(1).join(' ');

        if (!args.trim()) {
            return message.reply('Por favor proporciona el nuevo contenido del mensaje.');
        }

        try {
            // Obtener el ID del último mensaje enviado por el bot en el canal
            const lastBotMessageID = message.channel.lastBotMessageID;

            if (!lastBotMessageID) {
                return message.reply('No se encontró ningún mensaje reciente del bot en este canal.');
            }

            // Buscar y editar el mensaje
            const botMessage = await message.channel.messages.fetch(lastBotMessageID);
            await botMessage.edit(args);

            // Eliminar el mensaje del usuario que ejecutó el comando
            await message.delete();
        } catch (error) {
            console.error('Error al editar el mensaje:', error);
            // No se devuelve una respuesta para mantener el comportamiento solicitado
        }
    }
};
