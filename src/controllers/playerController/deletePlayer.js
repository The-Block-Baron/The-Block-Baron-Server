import Player from '../../models/player.model.js';
import EconomicAct from '../../models/economicAct.model.js';
import Company from '../../models/company.model.js';
import State from '../../models/state.model.js';


export const deletePlayer = async (req, res) => {
  try {
    const { role, id: userId } = req.user; 
    const playerId = req.params.id;


    if (role === 'player' && String(userId) !== String(playerId)) {
      return res.status(403).json({ error: 'Unauthorized to delete this player' });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }


    await EconomicAct.deleteMany({ player: playerId });


    const companiesToDelete = await Company.find({ ownerId: playerId });


    for (const company of companiesToDelete) {
      const stateId = company.state;
      const state = await State.findById(stateId);

      console.log(state)
    
      if (state) {
        state.builtCompanies.pull(company._id);
        await state.save();
      } else {
        console.error(`State not found for stateId: ${stateId}, companyId: ${company._id}`);
      }
    }


    await Company.deleteMany({ ownerId: playerId });


    await Player.deleteOne({ _id: playerId });

    res.status(200).json({ message: 'Jugador y todas las entidades asociadas eliminadas exitosamente' });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Error del servidor al eliminar el jugador y entidades asociadas' });
  }
};
