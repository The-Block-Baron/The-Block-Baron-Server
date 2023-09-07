import Player from '../models/player.model.js';
import EconomicAct from '../models/economicAct.model.js';
import Company from '../models/company.model.js';
import State from '../models/state.model.js';




export const updatePlayer = async (req, res) => {
  const { username, email, password, income, inGameTokens, isActive } = req.body;
  const { role, id: userId } = req.user; // Extract role and id from req.user
  const playerId = req.params.id;

  // Check if the user is authorized to update this player
  if (role === 'player' && String(userId) !== String(playerId)) {
    return res.status(403).json({ error: 'Unauthorized to update this player' });
  }

  if (username && username.length < 3) {
    return res.status(400).json({ error: 'El nombre de usuario debe tener al menos 3 caracteres.' });
  }

  try {
    const existingPlayer = await Player.findById(playerId);
    if (!existingPlayer) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    // Fields that can be updated by both roles
    if (username) existingPlayer.username = username;
    if (email) existingPlayer.email = email;
    if (password) existingPlayer.password = password;
    if (isActive !== undefined && role === 'admin') existingPlayer.isActive = isActive; // isActive can only be changed by admin
    
    // Fields that can be updated only by admin
    if (role === 'admin') {
      if (income) existingPlayer.income = income;
      if (inGameTokens !== undefined) existingPlayer.inGameTokens = inGameTokens;
      if (Array.isArray(req.body.Companies)) existingPlayer.Companies = req.body.Companies;
    }

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
    const { role, id: userId } = req.user; // Extract role and id from req.user
    const playerId = req.params.id;

    // Check if the user is authorized to delete this player
    if (role === 'player' && String(userId) !== String(playerId)) {
      return res.status(403).json({ error: 'Unauthorized to delete this player' });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    // Encuentra y elimina todas las actividades económicas asociadas con el jugador
    await EconomicAct.deleteMany({ player: playerId });

    // Encuentra todas las compañías asociadas con el jugador
    const companiesToDelete = await Company.find({ ownerId: playerId });

    // Borrar las entradas de las compañías en los estados relacionados
    for (const company of companiesToDelete) {
      const stateId = company.state;
      const state = await State.findById(stateId);
      
      // Aquí eliminamos la referencia a la compañía en el array `companies` del estado
      state.companies.pull(company._id);
      await state.save();
    }

    // Elimina todas las compañías asociadas con el jugador
    await Company.deleteMany({ ownerId: playerId });

    // Finalmente, elimina al jugador
    await Player.deleteOne({ _id: playerId });

    res.status(200).json({ message: 'Jugador y todas las entidades asociadas eliminadas exitosamente' });
  } catch (error) {
    console.error(error); // Para depuración
    res.status(500).json({ error: 'Error del servidor al eliminar el jugador y entidades asociadas' });
  }
};


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
    console.error(error); // Imprime el error
    
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
  