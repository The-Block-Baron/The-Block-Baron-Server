import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';


import https from 'https'
import fs from 'fs'

import playerRoutes from './src/routes/player.routes.js'
import stateRoutes from './src/routes/state.routes.js'
import economicRouter from './src/routes/economicAct.routes.js'
import authRouter from './src/routes/auth.routes.js';
import userRouter from './src/routes/user.routes.js'

dotenv.config();

let server;


const app = express();
const { PORT, CONNECTION_URI } = process.env;
const port = PORT || 2100;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

const allowedOrigins = ['http://localhost:5173', 'file://'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
  app.use(cors(corsOptions));

app.use(cookieParser())
app.use(compression());
app.use(morgan('dev'));


const httpsOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});


// Endpoint básico
app.get('/', () => {
    console.log('Servidor de Blockchain Baron en marcha');
    res.send('Servidor de Blockchain Baron en marcha'); 
});

app.use('/api/v1', playerRoutes)
app.use('/api/v1', stateRoutes)
app.use('/api/v1', economicRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1', userRouter)

// Middleware para manejar 404
app.use((req, res, next) => {
    res.status(404).send('Página no encontrada.');
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).send({ error: 'Invalid JSON' }); 
    }
    next();
  });
  

const connection = async () => {
    try {
        await mongoose.connect(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log('Falló la conexión a MongoDB:', error.message);
        throw error;
    }
};

export const startServer = async () => {
  try {
      console.log("Intentando conectar a MongoDB y arrancar el servidor...");
      await connection();

      server = https.createServer(httpsOptions, app).listen(port, () => {
          console.log(`Servidor de Blockchain Baron corriendo en https://localhost:${port} 🔥🎮`);
      });

  } catch (error) {
      console.error('Error al iniciar el servidor:', error.message);
  }
};

export const stopServer = (callback) => {
    if (server) {
      server.close(() => {
        console.log("Server stopped");
        callback();
      });
    } else {
      callback();
    }
  }


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

export default app

startServer();