const { Message } = require("discord.js");

//
module.exports = {
    description: 'Comando: Say, repite.',
    run: async (message) => {
        
            const botMessage = await "https://www.google.com/imgres?q=alejandro%20kretzig&imgurl=https%3A%2F%2Fwww.news.wolfsohn.edu.ar%2Fmedia%2Fimages%2FCumples%2520de%2520Alejandro%2520Kretzig%2520Fede%2520Cohen%2520Sabban%2520Demi%25C3%25A1n%2520Garfunkel%2520y%2520Camila%2520Sznurewicz%2520Octubre%25202013%2F%2Fimage%2520(96).jpg&imgrefurl=https%3A%2F%2Fwww.news.wolfsohn.edu.ar%2Fgaleria%2F%3Fid%3DCumples%2520de%2520Alejandro%2520Kretzig%2520Fede%2520Cohen%2520Sabban%2520Demi%25C3%25A1n%2520Garfunkel%2520y%2520Camila%2520Sznurewicz%2520Octubre%25202013%2F&docid=qILF6nbsqtuwXM&tbnid=D0YVX2eYHgJigM&vet=12ahUKEwicuMzNyJuIAxUHrZUCHYJ2BW0QM3oECBUQAA..i&w=375&h=500&hcb=2&ved=2ahUKEwicuMzNyJuIAxUHrZUCHYJ2BW0QM3oECBUQAA";

            // Guardar el ID del mensaje enviado por el bot en una propiedad del canal
            message.channel.send(botMessage)

            // Eliminar el mensaje original del usuario
            await message.delete();
        
    }
};
    