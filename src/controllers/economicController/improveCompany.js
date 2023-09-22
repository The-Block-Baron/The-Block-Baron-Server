import Player from '../../models/player.model.js';
import Company from '../../models/company.model.js';
import State from '../../models/state.model.js';


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

    const state = await State.findById(company.state);
    if (!state) {
      return res.status(404).json({ error: 'State not found' });
    }

    const typeDetails = state.availableCompanies.find(comp => comp.type === company.type);
    if (!typeDetails) {
      return res.status(400).json({ error: 'Company type not found in state' });
    }

    const upgradeCost = typeDetails.upgradeCost[company.level - 1];  
    
    if (role === 'player' && player.inGameTokens < upgradeCost) {
      return res.status(400).json({ error: 'Not enough tokens' });
    }
    
    if (role === 'player') {
      player.inGameTokens -= upgradeCost;
    }


    const currentIncomePerHour = typeDetails.incomePerHour[company.level - 1];
    const nextIncomePerHour = typeDetails.incomePerHour[company.level]; 
    const newIncomePerHour = nextIncomePerHour - currentIncomePerHour;
    const taxedIncomePerHour = newIncomePerHour - (newIncomePerHour * state.taxes / 100);



    player.companyIncome += taxedIncomePerHour;
    player.totalIncome = player.baseIncome + player.companyIncome;
    
    company.level += 1;
    company.incomePerHour = typeDetails.incomePerHour[company.level - 1];
    company.upgradeCost = typeDetails.incomePerHour[company.level - 1];
    company.buyingPrice = typeDetails.buyingPrice[company.level - 1];
    company.buildTime = typeDetails.buyingPrice[company.level - 1];
    company.upgradeTime = typeDetails.buyingPrice[company.level - 1];
    
    await company.save();
    await player.save();
    
    res.status(200).json({ company, player });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};