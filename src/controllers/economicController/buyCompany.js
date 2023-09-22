import Player from '../../models/player.model.js';
import Company from '../../models/company.model.js';
import State from '../../models/state.model.js';



export const buyCompany = async (req, res) => {
  try {
    const { companyId, id: buyerId } = req.params;
    const { sellerId } = req.body;
    const { role, id: userId } = req.user;


    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }


    if(String(company.ownerId) !== String(sellerId)) {
      return res.status(403).json({ error: 'Company does not belong to the seller' });
    }


    const buyer = await Player.findById(buyerId);
    const seller = await Player.findById(sellerId);

    if (!buyer || !seller) {
      return res.status(404).json({ error: 'Buyer or Seller not found' });
    }




    const buyingPrice = company.buyingPrice

    if(buyingPrice === undefined) {
      return res.status(400).json({ error: 'Buying price not defined for the current company level' });
    }

    if (role === 'player' && String(buyerId) !== String(userId)) {
      return res.status(403).json({ error: 'Unauthorized to buy this company' });
    }

    if (role !== 'admin' && buyer.inGameTokens < buyingPrice) {
      return res.status(400).json({ error: 'Not enough tokens' });
    }


    if(role !== 'admin') {
      buyer.inGameTokens -= buyingPrice;
    }


    const state = await State.findById(company.state);
    const sellerReceives = buyingPrice - (buyingPrice * state.taxes / 100);
    
    seller.inGameTokens += sellerReceives;


    const taxedIncomePerHour = company.incomePerHour - (company.incomePerHour * state.taxes / 100);
    seller.companyIncome -= taxedIncomePerHour; 
    buyer.companyIncome += taxedIncomePerHour; 
    buyer.totalIncome = buyer.baseIncome + buyer.companyIncome;
    seller.totalIncome = seller.baseIncome + seller.companyIncome;


    company.ownerId = buyer._id;


    seller.Companies = seller.Companies.filter(companyId => String(companyId) !== String(company._id));


    buyer.Companies.push(company._id);



    await buyer.save();
    await seller.save();
    await company.save();


    res.status(200).json({ message: 'Company bought successfully', company });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
