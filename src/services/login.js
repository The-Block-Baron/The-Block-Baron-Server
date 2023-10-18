import User from '../models/user.model.js';  
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import { ethers } from 'ethers';

export const validateLogin = [
  body('walletAddress').isString().isLength({ min: 42, max: 42 }).withMessage('Invalid Ethereum wallet address'),
  body('signedMessage').isString().withMessage('Signed message is required'),
  body('originalMessage').isString().withMessage('Original message is required'),
];

dotenv.config();

export const login = async (req, res) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { walletAddress, signedMessage, originalMessage } = req.body;

      const user = await User.findOne({ walletAddress }); 
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      let recoveredAddress;

      try {
          recoveredAddress =  ethers.verifyMessage(originalMessage, signedMessage);
      } catch (error) {
          console.error("Error verifying message:", error);
          return res.status(500).json({ message: "Error verifying message" });
      }

      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
          return res.status(400).json({ message: 'Signature verification failed' });
      }

      const userForToken = {
          id: user._id,
          username: user.username,
          walletAddress: user.walletAddress
      };

      const accessToken = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '24h' });

      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 24*60*60*1000 });

      res.status(200).json({ user });

      console.log('Login successful');
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};
