import schedule from 'node-schedule';
import Company from '../../models/company.model.js';
import Player from '../../models/player.model.js';
import Sabotage from '../../models/sabotage.model.js';

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

    const sabotageCost = targetCompany.sabotageCost[sabotageLevel - 1]; 

    console.log('sabotageCost:', sabotageCost);


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
      sabotageCost: sabotageCost
    });

    await sabotage.save();

    const reductionPercentage = [10, 25, 50, 75, 100][sabotageLevel - 1];
    const reducedIncome = targetCompany.incomePerHour * ((100 - reductionPercentage) / 100);

    const owner = await Player.findById(targetCompany.ownerId);
    owner.companyIncome = (await Promise.all(owner.Companies.map(async (companyId) => {
      if (String(companyId) === String(targetCompany._id)) {
        return reducedIncome;
      } else {
        const otherCompany = await Company.findById(companyId);
        return otherCompany.incomePerHour;
      }
    }))).reduce((acc, income) => acc + income, 0);
    
    owner.totalIncome = owner.baseIncome + owner.companyIncome;
    await owner.save();


    schedule.scheduleJob(sabotage.expiresAt, async function() {
      const company = await Company.findById(sabotage.targetCompany);
      const owner = await Player.findById(company.ownerId);
      owner.companyIncome += company.incomePerHour - reducedIncome;
      owner.totalIncome = owner.baseIncome + owner.companyIncome;

      await owner.save();
    });

    res.status(200).json({ message: 'Company sabotaged successfully', sabotage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
