import Player from "../../models/player.model.js";


export const getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
                                .populate({
                                  path: 'Companies',
                                  populate: { path: 'state' }
                                });
    
    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    
    res.status(200).json(player);
  } catch (error) {
    console.error(error); 
    
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'ID de jugador inválido' });
    } else {
      res.status(500).json({ error: 'Error del servidor al recuperar el jugador' });
    }
  }
};

  
  
  

  export const getActivePlayers = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50; 
      const activePlayers = await Player.find({ isActive: true }).limit(limit);
      res.status(200).json(activePlayers);
    } catch (error) {
      res.status(500).json({ error: 'Error del servidor al obtener los jugadores activos' });
    }
  };
  

  export const toggleAllPlayersStatus = async (req, res) => {
    try {
      await Player.updateMany({}, [{ $set: { isActive: { $not: "$isActive" } } }]);
      res.status(200).json({ message: 'Estado de todos los jugadores cambiado' });
    } catch (error) {
      res.status(500).json({ error: 'Error del servidor al cambiar el estado de los jugadores' });
    }
  };
  