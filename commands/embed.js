const { EmbedBuilder } = require('discord.js');

module.exports = {
    description: 'Comando: Message, dice.',
    run: async (message) => {
        const requiredRoleID = '1272329716279414908';
        const hasRole = message.member.roles.cache.has(requiredRoleID);

        if (!hasRole) {
            return message.reply('No tienes permiso para usar este comando.');
        }

        const args = message.content.split(' ').slice(1).join(' ');
        const attachments = message.attachments;

        if (args.trim().length < 1 && !attachments.size) {
            return message.reply('Por favor, proporciona un mensaje o una imagen para enviar.');
        }

        // Crea el embed
        const embed = new EmbedBuilder()
            .setTitle(args || 'Mensaje sin título') // Usa el texto proporcionado o un título predeterminado
            .setColor('#0099ff'); // Puedes ajustar el color del embed

        // Añade la primera imagen adjunta, si existe
        if (attachments.size > 0) {
            // Toma la primera imagen adjunta
            const attachment = attachments.first();
            embed.setImage(attachment.url);
        }

        // Envía el embed al canal
        message.channel.send({ embeds: [embed] })
            .catch(err => {
                console.error('Error al enviar el embed:', err);
                message.reply('Ocurrió un error al enviar el mensaje.');
            });
    }
};
