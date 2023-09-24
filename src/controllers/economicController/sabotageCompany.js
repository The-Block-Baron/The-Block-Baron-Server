import Company from '../models/company.model.js';
import Player from '../models/player.model.js';
import Sabotage from '../models/sabotage.model.js';

export const sabotageCompany = async (req, res) => {
  try {
    const { companyId, id: playerId } = req.params;
    const { sabotageLevel } = req.body;
    const { role, id: userId } = req.user;

    if (role !== 'admin' && String(playerId) !== String(userId)) {
      return res.status(403).json({ error: 'Not authorized to sabotage this company' });
    }

    const targetCompany = await Company.findById(companyId);
    const saboteur = await Player.findById(playerId);

    if (!targetCompany || !saboteur) {
      return res.status(404).json({ error: 'Target Company or Saboteur not found' });
    }

    if (sabotageLevel <= targetCompany.protectionLevel) {
      return res.status(400).json({ error: 'Sabotage level is not sufficient to sabotage this company' });
    }

    const sabotageCost = Sabotage.schema.path('sabotageCost').caster.options.enum[sabotageLevel - 1];
    
    if (role !== 'admin' && saboteur.inGameTokens < sabotageCost) {
      return res.status(400).json({ error: 'Not enough tokens' });
    }

    if (role !== 'admin') {
      saboteur.inGameTokens -= sabotageCost;
      await saboteur.save();
    }

    const sabotage = new Sabotage({
      level: sabotageLevel,
      saboteur: playerId,
      targetCompany: companyId,
    });

    await sabotage.save();

    res.status(200).json({ message: 'Company sabotaged successfully', sabotage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
