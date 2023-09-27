import express from 'express'
import jwt from 'jsonwebtoken';

import { register, login, validateRegistration, validateLogin } from "../services/auth.js";
import { adminRegister, adminLogin, validateAdminRegistration, validateAdminLogin } from "../services/adminAuth.js";


const authRouter = express.Router();

// Player Routes
authRouter.post('/register', validateRegistration, register);
authRouter.post('/login', validateLogin, login);

// Admin Routes
authRouter.post('/admin/register', validateAdminRegistration, adminRegister);
authRouter.post('/admin/login', validateAdminLogin, adminLogin);

authRouter.get('/is-authenticated', (req, res) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.json({ isAuthenticated: false });
    }
  
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      res.json({ isAuthenticated: true });
    } catch (error) {
      res.json({ isAuthenticated: false });
    }
});

  
  

export default authRouter;
