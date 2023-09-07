import EconomicAct from '../models/economicAct.model.js';
import Player from '../models/player.model.js';
import State from '../models/state.model.js';
import Company from '../models/company.model.js';

import { companyDetailsByType } from '../companyDetails.js';


// Controlador para obtener tipos de actividades económicas y tipos de mejoras
export const getEconomicActivitiesTypes = async (req, res) => {
  try {
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
    const { role, id: userId } = req.user;

    if (role === 'player' && String(userId) !== String(playerId)) {
      return res.status(403).json({ error: 'Unauthorized to build a company for this player' });
    }

    if (!companyDetailsByType.hasOwnProperty(companyName)) {
      return res.status(400).json({ error: 'Tipo de empresa no válido' });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    const state = await State.findById(stateId);
    if (!state) {
      return res.status(404).json({ error: 'Estado no encontrado' });
    }
    // Verificar si el jugador puede pagar la empresa
    const companyDetails = companyDetailsByType[companyName];
    if (player.inGameTokens < companyDetails.buildCost) {
      return res.status(400).json({ error: 'Tokens insuficientes para construir esta empresa' });
    }

    // Restar el costo de construcción del saldo del jugador
    player.inGameTokens -= companyDetails.buildCost;

    const newCompany = new Company({
      name: companyName,
      level: 1,
      state: stateId,
      incomePerHour: companyDetails.incomePerHour[0], // Ingreso según el nivel 1
      type: companyName,
      ownerId: playerId,
      buildCost: companyDetails.buildCost,
      upgradeCost: companyDetails.upgradeCost,
      buildTime: companyDetails.buildTime,
      upgradeTime: companyDetails.upgradeTime,
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
    player.Companies.push(newCompany._id);

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
    const { companyId, id: playerId } = req.params;
    const { role, id: userId } = req.user;  

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    if (role === 'player' && (String(company.ownerId) !== String(playerId) || String(userId) !== String(playerId))) {
      return res.status(403).json({ error: 'Unauthorized to improve this company' });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    if (company.level >= 5) {
      return res.status(400).json({ error: 'La empresa ya ha alcanzado el nivel máximo' });
    }

    const typeDetails = companyDetailsByType[company.type];
    const upgradeCost = typeDetails.upgradeCost[company.level - 1];  // assuming level starts at 1
    
    if (player.inGameTokens < upgradeCost) {
      return res.status(400).json({ error: 'Not enough tokens' });
    }

    player.inGameTokens -= upgradeCost;
    player.income += (typeDetails.incomePerHour[company.level] - typeDetails.incomePerHour[company.level - 1]);
    
    company.level += 1;
    company.incomePerHour = typeDetails.incomePerHour[company.level - 1];
    
    await company.save();
    await player.save();
    
    res.status(200).json({ company, player });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




export const closeCompany = async (req, res) => {
  try {
    const { companyId, id: playerId } = req.params;
    const { role, id: userId } = req.user;  // Extract role and id from req.user
    
    const company = await Company.findById(companyId);
    const player = await Player.findById(playerId);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check if the player exists
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Check for ownership and role-based access
    if (role === 'player' && (String(company.ownerId) !== String(playerId) || String(userId) !== String(playerId))) {
      return res.status(403).json({ error: 'Unauthorized to close this company' });
    }

    const typeDetails = companyDetailsByType[company.type];
    
    if (!typeDetails) {
      return res.status(400).json({ error: 'Invalid company type' });
    }

    const deleteCost = typeDetails.closeCost;  // Assuming specific cost for closing the type of company
    
    if (player.inGameTokens < deleteCost) {
      return res.status(400).json({ error: 'Not enough tokens to delete' });
    }
    
    player.inGameTokens -= deleteCost;
    player.income -= company.incomePerHour;
    player.Companies = player.Companies.filter(id => !id.equals(company._id));
    
    await Company.deleteOne({ _id: company._id });
    await player.save();
    
    res.status(200).json({ message: 'Company deleted', player });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
