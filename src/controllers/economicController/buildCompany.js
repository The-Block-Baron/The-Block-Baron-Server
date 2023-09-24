import Player from '../../models/player.model.js';
import EconomicAct from '../../models/economicAct.model.js';
import Company from '../../models/company.model.js';
import State from '../../models/state.model.js';


export const buildCompany = async (req, res) => {
  try {
    const { id: playerId } = req.params;
    const { companyType, fictionalName, stateId } = req.body;
    const { role, id: userId } = req.user;

    if (role === 'player' && String(userId) !== String(playerId)) {
      return res.status(403).json({ error: 'Unauthorized to build a company for this player' });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    const state = await State.findById(stateId);
    if (!state) {
      return res.status(404).json({ error: 'Estado no encontrado' });
    }

    
    const companyDetails = state.availableCompanies.find(company => company.type === companyType);
    
    if (!companyDetails) {
      return res.status(400).json({ error: 'Tipo de empresa no válido' });
    }

    if (role === 'player' && player.inGameTokens < companyDetails.buildCost) {
      return res.status(400).json({ error: 'Tokens insuficientes para construir esta empresa' });
    }

    if (role === 'player') {
      player.inGameTokens -= companyDetails.buildCost;
    }

    const newCompany = new Company({
      name: fictionalName,
      level: companyDetails.level[0],
      state: stateId,
      incomePerHour: companyDetails.incomePerHour[0], 
      type: companyType,
      ownerId: playerId,
      buildCost: companyDetails.buildCost,
      upgradeCost: companyDetails.upgradeCost[0],
      buyingPrice: companyDetails.buyingPrice[0],
      buildTime: companyDetails.buildTime[0],
      upgradeTime: companyDetails.upgradeTime[0],
      protectionPrices: companyDetails.protectionPrices[0],
      protectionLevel: companyDetails.protectionLevel[0],
      protectionCost: companyDetails.protectionCost[0],
      sabotageCost: companyDetails.sabotageCost
    });

    await newCompany.save();

    const newEconomicAct = new EconomicAct({
      type: 'create',
      player: playerId,
      company: newCompany._id,
      state: stateId,
    });

    await newEconomicAct.save();

    state.builtCompanies.push(newCompany._id);
    await state.save();

    const taxedIncomePerHour = newCompany.incomePerHour - (newCompany.incomePerHour * state.taxes / 100);
    player.companyIncome += taxedIncomePerHour; 
    player.totalIncome = player.baseIncome + player.companyIncome;

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