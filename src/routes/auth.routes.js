import express from 'express'
import jwt from 'jsonwebtoken';

import { register, login, validateRegistration, validateLogin } from "../services/auth.js";
import { adminRegister, adminLogin, validateAdminRegistration, validateAdminLogin } from "../services/adminAuth.js";
import { BlacklistedToken } from '../models/blacklist.model.js';


const authRouter = express.Router();

// Player Routes
authRouter.post('/register', validateRegistration, register);
authRouter.post('/login', validateLogin, login);

// Admin Routes
authRouter.post('/admin/register', validateAdminRegistration, adminRegister);
authRouter.post('/admin/login', validateAdminLogin, adminLogin);

authRouter.get('/is-authenticated', async (req, res) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.json({ isAuthenticated: false });
    }
  
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.json({ isAuthenticated: false });
    }
  
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      res.json({ isAuthenticated: true });
    } catch (error) {
      res.json({ isAuthenticated: false });
    }
  });
  
  authRouter.post('/logout', async (req, res) => {
    console.log('Logout route hit')
    const token = req.cookies.token;
    
    if (token) {
      // Clear the token cookie
      res.clearCookie('token');
      
      try {
        const blacklistedToken = new BlacklistedToken({ token });
        await blacklistedToken.save();
        res.status(200).json({ message: 'Logged out successfully' });
      } catch (error) {
        console.error('Error blacklisting token:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      res.status(200).json({ message: 'Logged out successfully' });
    }
  });
  
  
  

export default authRouter;
