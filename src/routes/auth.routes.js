import express from 'express'

import { register, login, validateRegistration, validateLogin } from "../services/auth.js";
import { adminRegister, adminLogin, validateAdminRegistration, validateAdminLogin } from "../services/adminAuth.js";


const authRouter = express.Router();

// Player Routes
authRouter.post('/register', validateRegistration, register);
authRouter.post('/login', validateLogin, login);

// Admin Routes
authRouter.post('/admin/register', validateAdminRegistration, adminRegister);
authRouter.post('/admin/login', validateAdminLogin, adminLogin);

export default authRouter;
