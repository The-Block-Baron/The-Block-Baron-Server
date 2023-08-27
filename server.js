import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'

dotenv.config()

const app = express()

const {PORT} = process.env
const port = PORT || 2100;


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

const startServer = async () => {
    app.listen(port, () => {
    console.log(`Servidor de Blockchain Baron corriendo en http://localhost:${port} 🔥🎮`)
})
}

startServer()