import Player from '../models/player.model.js';
import EconomicAct from '../models/economicAct.model.js';


export const createPlayer = async (req, res) => {
  try {
    const newPlayer = new Player(req.body);
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    res.status(200).json({ message: 'Jugador eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      res.status(400).json({ error: error.message });
    }
  };
  

  export const getActivePlayers = async (req, res) => {
    try {
      const activePlayers = await Player.find({ isActive: true });
      res.status(200).json(activePlayers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  export const toggleAllPlayersStatus = async (req, res) => {
    try {
      const players = await Player.find({});
      for (const player of players) {
        player.isActive = !player.isActive;
        await player.save();
      }
      res.status(200).json({ message: 'Estado de todos los jugadores cambiado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

