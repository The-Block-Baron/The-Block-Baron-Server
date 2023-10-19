import express from 'express'

import { register } from '../services/register.js';
import { login } from '../services/login.js';
import { validateRegistration } from '../services/register.js';
import { validateLogin } from '../services/login.js';
import { logout } from '../services/logout.js';
import { playerDetails } from '../services/playerDetails.js';
import { isAuthenticated } from '../services/isAuthenticated.js';
import { checkToken } from '../services/checkToken.js';
import loginLimiter from '../middlewares/loginLimiter.js';


const authRouter = express.Router();

// Player Routes
authRouter.post('/register', validateRegistration, register);
authRouter.post('/login', validateLogin, loginLimiter, login);
authRouter.get('/is-authenticated', isAuthenticated);
authRouter.post('/logout', logout);
authRouter.get('/player-details', playerDetails);
authRouter.get('/check-token', checkToken);

export default authRouter;
