import EconomicAct from '../models/economicAct.model.js';
import Player from '../models/player.model.js';
import State from '../models/state.model.js';
import Company from '../models/company.model.js';


// Controlador para obtener tipos de actividades económicas y tipos de mejoras
export const getEconomicActivitiesTypes = async (req, res) => {
  try {
    // Simplemente retornamos los tipos que son permitidos según el modelo.
    // No estamos haciendo una consulta a la base de datos aquí,
    // estamos enviando directamente los valores enumerados que definimos en el modelo.
    const activityTypes = EconomicAct.schema.path('type').enumValues;

    res.status(200).json({ activityTypes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const buildCompany = async (req, res) => {
    try {
      const { id: playerId } = req.params;
      const { companyName, stateId } = req.body;
    
      const player = await Player.findById(playerId);
      if (!player) {
        return res.status(404).json({ error: 'Jugador no encontrado' });
      }
    
      const state = await State.findById(stateId);
      if (!state) {
        return res.status(404).json({ error: 'Estado no encontrado' });
      }
    
      const newCompany = new Company({
        name: companyName,
        level: 1,
        state: stateId,
        incomePerHour: 1000,
        type: companyName,
        ownerId: playerId
      });
    
      await newCompany.save();
    
      const newEconomicAct = new EconomicAct({
        type: 'create',
        player: playerId,
        company: newCompany._id,
        state: stateId,
      });
    
      await newEconomicAct.save();
  
      // Incrementar el ingreso del jugador
      player.income += newCompany.incomePerHour; // <--- Aquí está el cambio
  
      // Añadir la nueva compañía al jugador
      player.Companies.push(newCompany._id); // Asegúrate de agregar el ID de la nueva compañía
    
      await player.save();
    
      res.status(201).json({ 
        economicActId: newEconomicAct._id,
        company: newCompany 
      });
    
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  