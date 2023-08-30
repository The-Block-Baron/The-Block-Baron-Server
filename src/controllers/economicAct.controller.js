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

      state.companies.push(newCompany._id);
      await state.save();
  
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
  

  export const improveCompany = async (req, res) => {
    try {
      const { id: playerId, companyId } = req.params;
  
      const player = await Player.findById(playerId);
      const company = await Company.findById(companyId);
  
      if (!player) {
        return res.status(404).json({ error: 'Jugador no encontrado' });
      }
  
      if (!company) {
        return res.status(404).json({ error: 'Empresa no encontrada' });
      }
  
      // Comprobar si la mejora es válida
      if (company.level >= 5) {
        return res.status(400).json({ error: 'La empresa ya ha alcanzado el nivel máximo' });
      }
  
      // Guardar el ingreso anterior de la empresa para calcular correctamente
      const oldIncomePerHour = company.incomePerHour;
  
      // Lógica para mejorar la empresa
      company.level += 1;
      company.incomePerHour *= 1.2;  // Incremento del 20%
      await company.save();
  
      // Lógica para actualizar el ingreso del jugador
      player.income = player.income - oldIncomePerHour + company.incomePerHour;
      await player.save();
  
      res.status(200).json({ message: 'Empresa mejorada exitosamente', company });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error del servidor al mejorar la empresa' });
    }
  };
  