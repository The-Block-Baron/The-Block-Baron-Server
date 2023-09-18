import EconomicAct from '../models/economicAct.model.js';
import Player from '../models/player.model.js';
import State from '../models/state.model.js';
import Company from '../models/company.model.js';



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
      level: 1,
      state: stateId,
      incomePerHour: companyDetails.incomePerHour[0], 
      type: companyType,
      ownerId: playerId,
      buildCost: companyDetails.buildCost,
      upgradeCost: companyDetails.upgradeCost,
      buyingPrice: companyDetails.buyingPrice[0],
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

    const upgradeCost = typeDetails.upgradeCost[company.level - 1];  // assuming level starts at 1
    
    if (role === 'player' && player.inGameTokens < upgradeCost) {
      return res.status(400).json({ error: 'Not enough tokens' });
    }
    
    if (role === 'player') {
      player.inGameTokens -= upgradeCost;
    }


    const currentIncomePerHour = typeDetails.incomePerHour[company.level - 1];
    const nextIncomePerHour = typeDetails.incomePerHour[company.level]; // This was potentially undefined because company.level could be 5, translating to a non-existent index 5 in a 0-4 indexed array.
    const newIncomePerHour = nextIncomePerHour - currentIncomePerHour;
    const taxedIncomePerHour = newIncomePerHour - (newIncomePerHour * state.taxes / 100);



    player.companyIncome += taxedIncomePerHour;
    player.totalIncome = player.baseIncome + player.companyIncome;
    
    company.level += 1;
    company.incomePerHour = typeDetails.incomePerHour[company.level - 1];
    company.buyingPrice = typeDetails.buyingPrice[company.level - 1];
    
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

    const state = await State.findById(company.state);
    if (!state) {
      return res.status(404).json({ error: 'State not found' });
    }

    const typeDetails = state.availableCompanies.find(comp => comp.type === company.type);
    
    if (!typeDetails) {
      return res.status(400).json({ error: 'Invalid company type' });
    }

    const deleteCost = typeDetails.closeCost;  // Assuming specific cost for closing the type of company
    
    if (player.inGameTokens < deleteCost) {
      return res.status(400).json({ error: 'Not enough tokens to delete' });
    }
    
    if (role === 'player') {
      player.inGameTokens -= deleteCost;  // Corrected from upgradeCost to deleteCost
    }

    const taxedIncomePerHour = company.incomePerHour - (company.incomePerHour * state.taxRate / 100);

    player.companyIncome -= taxedIncomePerHour;
    player.totalIncome = player.baseIncome + player.companyIncome;

  
    player.Companies = player.Companies.filter(id => !id.equals(company._id));
    
    // Remove the company ID from the state's list of built companies
    state.builtCompanies = state.builtCompanies.filter(id => !id.equals(company._id));
    
    await Company.deleteOne({ _id: company._id });
    await player.save();
    await state.save();
    
    res.status(200).json({ message: 'Company deleted', player });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const buyCompany = async (req, res) => {
  try {
    const { companyId, id: buyerId } = req.params;
    const { sellerId } = req.body;
    const { role, id: userId } = req.user;

    // Fetch the company details using companyId
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Ensure the company belongs to the seller
    if(String(company.ownerId) !== String(sellerId)) {
      return res.status(403).json({ error: 'Company does not belong to the seller' });
    }

    // Fetch the buyer and seller details
    const buyer = await Player.findById(buyerId);
    const seller = await Player.findById(sellerId);

    if (!buyer || !seller) {
      return res.status(404).json({ error: 'Buyer or Seller not found' });
    }


    // Check if the buyer has enough tokens to buy the company

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

// ...


    // Deduct the buying price from the buyer's tokens if not admin
    if(role !== 'admin') {
      buyer.inGameTokens -= buyingPrice;
    }

    // Calculate the amount the seller receives after tax
    const state = await State.findById(company.state);
    const sellerReceives = buyingPrice - (buyingPrice * state.taxes / 100);
    
    seller.inGameTokens += sellerReceives;

    // Adjust the income of the buyer
    const taxedIncomePerHour = company.incomePerHour - (company.incomePerHour * state.taxes / 100);
    seller.companyIncome -= taxedIncomePerHour; 
    buyer.companyIncome += taxedIncomePerHour; 
    buyer.totalIncome = buyer.baseIncome + buyer.companyIncome;
    seller.totalIncome = seller.baseIncome + seller.companyIncome;

    // Change the ownership of the company
    company.ownerId = buyer._id;

    // Remove the company from the seller's list of owned companies
    seller.Companies = seller.Companies.filter(companyId => String(companyId) !== String(company._id));

    // Add the company to the buyer's list of owned companies
    buyer.Companies.push(company._id);


    // Save the changes
    await buyer.save();
    await seller.save();
    await company.save();

    // Respond with success and the updated company details
    res.status(200).json({ message: 'Company bought successfully', company });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
