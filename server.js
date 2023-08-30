import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';

import playerRoutes from './src/routes/player.routes.js'
import stateRoutes from './src/routes/state.routes.js'
import economicRouter from './src/routes/economicAct.routes.js'

dotenv.config();

const app = express();
const { PORT, CONNECTION_URI } = process.env;
const port = PORT || 2100;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});


// Endpoint básico
app.get('/', () => {
    console.log('Servidor de Blockchain Baron en marcha');
});

app.use('/api/v1', playerRoutes)
app.use('/api/v1', stateRoutes)
app.use('/api/v1', economicRouter)

// Middleware para manejar 404
app.use((req, res, next) => {
    res.status(404).send('Página no encontrada.');
});

const connection = async () => {
    try {
        await mongoose.connect(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Failed to connect to MongoDB:', error.message);
        throw error;
    }
};

const startServer = async () => {
    try {
        await connection();
        app.listen(port, () => {
            console.log(`Servidor de Blockchain Baron corriendo en http://localhost:${port} 🔥🎮`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
    }
};



// Manejadores para cerrar la conexión correctamente
process.on('SIGTERM', () => {
    mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada.');
    process.exit(0);
});

process.on('SIGINT', () => {
    mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada.');
    process.exit(0);
});

startServer();