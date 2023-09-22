import Player from '../../models/player.model.js';
import Company from '../../models/company.model.js';
import State from '../../models/state.model.js';


export const closeCompany = async (req, res) => {
  try {
    const { companyId, id: playerId } = req.params;
    const { role, id: userId } = req.user; 
    
    const company = await Company.findById(companyId);
    const player = await Player.findById(playerId);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }


    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }


    if (role === 'player' && (String(company.ownerId) !== String(playerId) || String(userId) !== String(playerId))) {
      return res.status(403).json({ error: 'Unauthorized to close this company' });
    }

    const state = await State.findById(company.state);
    if (!state) {
      return res.status(404).json({ error: 'State not found' });
    }

    const typeDetails = state.availableCompanies.find(comp => comp.type === company.type);
    
    if (!typeDetails) {
      return res.status(400).json({ error: 'Invalid company type' });
    }

    const deleteCost = typeDetails.closeCost; 
    
    if (player.inGameTokens < deleteCost) {
      return res.status(400).json({ error: 'Not enough tokens to delete' });
    }
    
    if (role === 'player') {
      player.inGameTokens -= deleteCost;  
    }

    const taxedIncomePerHour = company.incomePerHour - (company.incomePerHour * state.taxRate / 100);

    player.companyIncome -= taxedIncomePerHour;
    player.totalIncome = player.baseIncome + player.companyIncome;

  
    player.Companies = player.Companies.filter(id => !id.equals(company._id));
    

    state.builtCompanies = state.builtCompanies.filter(id => !id.equals(company._id));
    
    await Company.deleteOne({ _id: company._id });
    await player.save();
    await state.save();
    
    res.status(200).json({ message: 'Company deleted', player });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};