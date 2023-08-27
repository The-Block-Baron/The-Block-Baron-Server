import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import mongoose from 'mongoose'

dotenv.config()

const app = express()

const port = process.env.PORT || 2100;


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(morgan('dev'))

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});


app.get('/', ()=> {
    console.log('Servidor de Blockchain Baron en marcha')
})

const connection = async () => {
    try {
      await mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.log('Failed to connect to MongoDB:', error.message);
      throw error;
    }
};

const startServer = async () => {
    try{
        await connection()
        app.listen(port, () => {
        console.log(`Servidor de Blockchain Baron corriendo en http://localhost:${port} 🔥🎮`)
        })
    } catch (error) {

    }

}

startServer()