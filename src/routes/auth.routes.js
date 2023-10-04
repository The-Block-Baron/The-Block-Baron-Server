import express from 'express'

import { register, login, validateRegistration, validateLogin, logout, playerDetails, isAuthenticated } from "../services/auth.js";


const authRouter = express.Router();

// Player Routes
authRouter.post('/register', validateRegistration, register);
authRouter.post('/login', validateLogin, login);
authRouter.get('/is-authenticated', isAuthenticated);
authRouter.post('/logout', logout);
authRouter.get('/player-details', playerDetails);

export default authRouter;
