import mongoose from "mongoose"
import dotenv from 'dotenv'
import Player from "../models/player.model.js"

dotenv.config()

const seedDB = async () =>{
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Data to be added
    const players = [
      { username: 'Dipri', income: 200, inGameTokens: 400 },
      { username: 'Psylow', income: 200, inGameTokens: 200 },
      { username: 'Kriptonix', income: 200, inGameTokens: 100 },
      { username: 'Zypher', income: 200, inGameTokens: 50 },
      { username: 'Perriqui', income: 200, inGameTokens: 25 }
    ];

    // Clear existing players
    await Player.deleteMany({});

    // Add new players
    await Player.insertMany(players);

    console.log('Database seeded!');
  } catch (error) {
    console.error('Failed to seed database', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run the function
seedDB();
