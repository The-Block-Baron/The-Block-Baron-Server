import mongoose from 'mongoose';
import dotenv from 'dotenv'
import State from '../models/state.model.js';

import Adventure from '../data/Adventureanch.json' assert { type: 'json' };
// import Fortune from '../data/Fortuneholt.json' assert { type: 'json' };
// import Harmony from '../data/Harmonyhaven.json' assert { type: 'json' };
// import Valor from '../data/Valorstead.json' assert { type: 'json' };
// import Wisdom from '../data/Wisdomshire.json' assert { type: 'json' };



dotenv.config();

const Schema = mongoose.Schema;

async function createStates() {
  try {
    await mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Remove any existing State data
    await State.deleteMany({});

    // Create new State data
    const statesData = [
      Adventure,
      Adventure,
      Adventure,
      Adventure,
      Adventure,
      // Fortune,
      // Harmony,
      // Valor,
      // Wisdom,
    ];
    
    await State.insertMany(statesData);

    console.log('State data created successfully!');
  } catch (error) {
    console.error('Error creating state data:', error);
  } finally {
    mongoose.connection.close();
  }
}

createStates();