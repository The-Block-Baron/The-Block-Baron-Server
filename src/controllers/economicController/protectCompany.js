import Player from '../../models/player.model.js';
import Company from '../../models/company.model.js';
import State from '../../models/state.model.js';



export const protectCompany = async (req, res) => {
  try {
    const { companyId, id: playerId } = req.params;
    const { role, id: userId } = req.user;

    const company = await Company.findById(companyId);
    const player = await Player.findById(playerId);

    if (!company || !player) {
      return res.status(404).json({ error: 'Company or Player not found' });
    }


    if (role !== 'admin' && String(company.ownerId) !== String(playerId)) {
      return res.status(403).json({ error: 'Not authorized to protect this company' });
    }

 
    if (company.protectionLevel >= 5) {
      return res.status(400).json({ error: 'Company protection level cannot be increased further' });
    }


    const state = await State.findById(company.state);
    if (!state) {
      return res.status(404).json({ error: 'State not found' });
    }


    const typeDetails = state.availableCompanies.find(comp => comp.type === company.type);
    if (!typeDetails) {
      return res.status(404).json({ error: 'Company details not found' });
    }

    const protectionCost = typeDetails.protectionCost[company.protectionLevel];
    const protectionPriceMultiplier = typeDetails.protectionPrices[company.protectionLevel];


    if (isNaN(protectionCost) || typeof protectionCost !== 'number') {
      return res.status(400).json({ error: 'Invalid protection cost' });
    }

    if (isNaN(protectionPriceMultiplier) || typeof protectionPriceMultiplier !== 'number') {
      return res.status(400).json({ error: 'Invalid protection price multiplier' });
    }


    if (role !== 'admin' && player.inGameTokens < protectionCost) {
      return res.status(400).json({ error: 'Not enough tokens' });
    }


    if (role !== 'admin') {
      player.inGameTokens -= protectionCost;
      await player.save();
    }


    company.protectionLevel += 1;

    if (protectionPriceMultiplier !== "non-buyable") {
      company.buyingPrice *= protectionPriceMultiplier;
    }

    if (company.protectionLevel < 5) {
      company.protectionCost = typeDetails.protectionCost[company.protectionLevel];
    }


    await company.save();


    res.status(200).json({ message: 'Company protected successfully', company });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
