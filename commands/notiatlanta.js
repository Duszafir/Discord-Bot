const { EmbedBuilder } = require('discord.js');

module.exports = {
    description: 'Comando: Elige un usuario aleatorio y dice que es "noti atlanta".',
    run: async (message) => {
        // Obtén todos los miembros del servidor
        const members = message.guild.members.cache.filter(member => !member.user.bot).map(member => member.user);
        
        // Verifica si hay miembros en la lista
        if (members.length === 0) {
            return message.reply('No hay miembros en el servidor.');
        }

        // Selecciona un usuario aleatorio
        const randomMember = members[Math.floor(Math.random() * members.length)];

        // Crea un nuevo embed
        const embed = new EmbedBuilder()
            .setColor('#0033a0') // Color del borde del embed, azul de Atlanta
            .setTitle('Noti Atlanta')
            .setDescription(`${randomMember.username} es noti atlanta!`)
            .setTimestamp() // Marca la fecha y hora
            .setFooter({ text: 'tantan' }); // Pie de página opcional

        // Envía el embed al canal
        message.channel.send({ embeds: [embed] });
    }
};
