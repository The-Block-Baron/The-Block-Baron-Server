import mongoose from "mongoose";
import dotenv from 'dotenv';
import Player from "../models/player.model.js";
import Company from "../models/company.model.js";  // Asegúrate de importar este modelo
import State from "../models/state.model.js";      // Asegúrate de importar este modelo
import EconomicAct from "../models/economicAct.model.js"; // Asegúrate de importar este modelo

dotenv.config();

const seedDB = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Borrar datos existentes
    await Player.deleteMany({});
    await Company.deleteMany({}); // Borrar todas las compañías
    await State.updateMany({}, { $set: { companies: [] }}); // Borrar las referencias de compañías en estados
    await EconomicAct.deleteMany({}); // Borrar todas las actividades económicas

    // Datos para añadir
    const players = [
      { username: 'Dipri', income: 200, inGameTokens: 400 },
      { username: 'Psylow', income: 200, inGameTokens: 200 },
      { username: 'Kriptonix', income: 200, inGameTokens: 100 },
      { username: 'Zypher', income: 200, inGameTokens: 50 },
      { username: 'Perriqui', income: 200, inGameTokens: 25 }
    ];

    // Añadir nuevos jugadores
    await Player.insertMany(players);

    console.log('Database seeded!');
  } catch (error) {
    console.error('Failed to seed database', error);
  } finally {
    // Desconectar de MongoDB
    mongoose.disconnect();
  }
};

// Ejecutar la función
seedDB();
