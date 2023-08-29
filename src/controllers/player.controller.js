import Player from '../models/player.model.js';
import EconomicAct from '../models/economicAct.model.js';


export const createPlayer = async (req, res) => {

    const { username, income, inGameTokens, isActive } = req.body;
  
    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'El nombre de usuario es requerido y debe tener al menos 3 caracteres.' });
    }

  
    try {
      const existingPlayer = await Player.findOne({ username });
      if (existingPlayer) {
        return res.status(400).json({ error: 'El nombre de usuario ya existe.' });
      }
  
      const newPlayer = new Player({
        username,
        income: income || 200,
        inGameTokens: inGameTokens || 0,
        isActive: isActive !== undefined ? isActive : true
      });
  
      await newPlayer.save();
      res.status(201).json(newPlayer);
      
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error del servidor al crear el jugador.' });
      }
    }
  };
  

export const updatePlayer = async (req, res) => {
  const { username, income, inGameTokens, isActive } = req.body;

  if (username && username.length < 3) {
    return res.status(400).json({ error: 'El nombre de usuario debe tener al menos 3 caracteres.' });
  }


  try {
    const existingPlayer = await Player.findById(req.params.id);
    if (!existingPlayer) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    if (username) existingPlayer.username = username;
    if (income) existingPlayer.income = income;
    if (inGameTokens !== undefined) existingPlayer.inGameTokens = inGameTokens;
    if (isActive !== undefined) existingPlayer.isActive = isActive;

    await existingPlayer.save();

    res.status(200).json(existingPlayer);
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error del servidor al actualizar el jugador.' });
    }
  }
};


export const deletePlayer = async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);
      if (!player) {
        return res.status(404).json({ error: 'Jugador no encontrado' });
      }

      await player.remove();
  
      res.status(200).json({ message: 'Jugador eliminado exitosamente' });
    } catch (error) {
      if (error.name === 'CastError') {
        res.status(400).json({ error: 'ID de jugador inválido' });
      } else {
        res.status(500).json({ error: 'Error del servidor al eliminar el jugador' });
      }
    }
  };
  


  export const getPlayer = async (req, res) => {
    try {
      const player = await Player.findById(req.params.id).populate('economicActivities');
      if (!player) {
        return res.status(404).json({ error: 'Jugador no encontrado' });
      }
      res.status(200).json(player);
    } catch (error) {
      if (error.name === 'CastError') {
        res.status(400).json({ error: 'ID de jugador inválido' });
      } else {
        res.status(500).json({ error: 'Error del servidor al obtener el jugador' });
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
  