import schedule from 'node-schedule'
import Player from '../models/player.model.js'

console.log("Script de updateTokens.js ejecutado");  // Esto debería mostrarse si el script se está ejecutando

// Actualiza los inGameTokens de todos los jugadores activos
async function updatePlayerTokens() {
    try {
        const players = await Player.find({ isActive: true });
        players.forEach(async (player) => {
            player.inGameTokens += player.income;
            await player.save();
            console.log(`Tokens actualizados para ${player.username}.`);
        });
    } catch (error) {
        console.error("Ocurrió un error durante la actualización de tokens:", error);
    }
}

// Programa el trabajo para que se ejecute cada hora en punto
try {
    const job = schedule.scheduleJob('0 * * * *', function() {
        console.log('Intentando actualizar inGameTokens para todos los jugadores activos.');
        updatePlayerTokens().catch(console.error);
    });
    console.log('Trabajo programado configurado');  // Esto debería mostrarse si la programación del trabajo es exitosa
} catch (error) {
    console.error('Error al programar el trabajo:', error);
}
