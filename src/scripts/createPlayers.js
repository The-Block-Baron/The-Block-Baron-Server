import mongoose from "mongoose";
import dotenv from 'dotenv';
import Player from "../models/player.model.js";
import Company from "../models/company.model.js";  
import State from "../models/state.model.js";      
import EconomicAct from "../models/economicAct.model.js"; 

dotenv.config();

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Delete existing data
    await Player.deleteMany({});
    await Company.deleteMany({}); 
    await State.updateMany({}, { $set: { companies: [] }}); 
    await EconomicAct.deleteMany({}); 

    // Data to seed
    const players = [
      { username: 'Dipri', income: 200, inGameTokens: 400, email: 'dipri@email.com', password: '123456' },
      { username: 'Psylow', income: 200, inGameTokens: 200, email: 'psylow@email.com', password: '123456' },
      { username: 'Kriptonix', income: 200, inGameTokens: 100, email: 'kriptonix@email.com', password: '123456' },
      { username: 'Zypher', income: 200, inGameTokens: 50, email: 'zypher@email.com', password: '123456' },
      { username: 'Perriqui', income: 200, inGameTokens: 25, email: 'perriqui@email.com', password: '123456' },
    ];

    // Add new players
    for (const playerData of players) {
      const player = new Player(playerData);
      await player.save();
    }

    console.log('Database seeded!');
  } catch (error) {
    console.error('Failed to seed database', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
};

// Run the function
seedDB();
