import Player from "../../models/player.model.js";




export const updatePlayer = async (req, res) => {
  const { username, email, password, income, inGameTokens, isActive } = req.body;
  const { role, id: userId } = req.user; 
  const playerId = req.params.id;


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


    if (username) existingPlayer.username = username;
    if (email) existingPlayer.email = email;
    if (password) existingPlayer.password = password;
    if (isActive !== undefined && role === 'admin') existingPlayer.isActive = isActive;
    

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