const { Message } = require("discord.js");

module.exports = {
    description: 'Comando: Message, dice.',
    run: async (message) => {
        const requiredRoleID = '1272329716279414908';
        const hasRole = message.member.roles.cache.has(requiredRoleID);

        if (!hasRole) {
            return message.reply('No tienes permiso para usar este comando.');
        }

        const args = message.content.split(' ').slice(1).join(' ');

        if (args.trim().length < 1 && !message.attachments.size) {
            return message.reply('Por favor, proporciona un mensaje o una imagen para enviar.');
        }

        if (args.trim().length > 0) {
            const botMessage = await message.channel.send(args);

            // Guardar el ID del mensaje enviado por el bot en una propiedad del canal
            message.channel.lastBotMessageID = botMessage.id;

            // Eliminar el mensaje original del usuario
            await message.delete();
        }
    }
};
