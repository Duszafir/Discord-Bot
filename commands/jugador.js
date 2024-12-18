const { EmbedBuilder } = require('discord.js');

// Lista actualizada de jugadores del Club Atlético Atlanta en 2024
const players = [
    "Dylan Gissi (Defensa)",
    "Tomás Ariel Silva (Defensa)",
    "Nicolás Previtali (Centrocampista)",
    "Mauricio Rosales (Defensa)",
    "Leonardo Marinucci (Delantero)",
    "Gabriel Vega (Centrocampista)",
    "Érik Bodencer (Delantero)",
    "Fernando Evangelista (Defensa)",
    "Alejandro Miguel Sánchez (Arquero)",
    "Alejo Martín Dramisino (Centrocampista)",
    "Carlos Arce (Centrocampista)",
    "Federico Arturo Bisanz (Centrocampista)",
    "Jonathan Cañete (Delantero)",
    "Maximiliano González (Centrocampista)",
    "Joaquín Susvielles (Delantero)",
    "Carlo Lattanzio (Centrocampista)",
    "Caín Fara (Defensa)",
    "Juan Requena (Centrocampista)",
    "Ivo Alexis Costantino (Delantero)",
    "Santino Uriel Pasini (Defensa)",
    "Bruno Galván (Arquero)",
    "Luis Arroyo (Delantero)",
    "Nicolás Gustavo Mosca (Centrocampista)",
    "Thiago Román Herrera (Defensa)",
    "Leonardo Ezequiel Flores (Defensa)",
    "Vito Fernando Esmay (Delantero)",
    "Robinson Ricardo Paterson Sepúlveda (Delantero)",
    "Tomás Alejandro Rojas (Defensa)",
    "David Ezequiel Maguicha Cáceres (Delantero)",
    "Federico Martin Velazquez Kemmerer (Arquero)",
    "Nicolás Argentino Medina (Centrocampista)"
];

module.exports = {
    description: 'Comando: Elige un jugador de Atlanta 2024.',
    run: (message) => {
        const randomPlayer = players[Math.floor(Math.random() * players.length)];

        // Crea un nuevo embed
        const embed = new EmbedBuilder()
            .setColor('#0033a0') // Color del borde del embed, azul de Atlanta
            .setTitle('Quien sos?')
            .setDescription(` ¡Sos: **${randomPlayer}**!`)
            .setTimestamp() // Marca la fecha y hora
            .setFooter({ text:`${message.author.username}`}); // Pie de página opcional

        // Envía el embed al canal
        message.channel.send({ embeds: [embed] });
    }
};
