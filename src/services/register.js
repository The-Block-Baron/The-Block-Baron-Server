import User from '../models/user.model.js';  
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';

dotenv.config();

export const validateRegistration = [
  body('username').isString().withMessage('Username must be a string').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
  body('walletAddress').isString().isLength({ min: 42, max: 42 }).withMessage('Invalid Ethereum wallet address'),
  body('email').isEmail().withMessage('Invalid email format'), 
];

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { username, walletAddress, email } = req.body;

  try {
      const existingUser = await User.findOne({
          $or: [
              { walletAddress },
              { username },
              { email }
          ]
      });

      if (existingUser) {
          if (existingUser.walletAddress === walletAddress) {
              return res.status(400).json({ message: 'Wallet address already registered' });
          }
          if (existingUser.username === username) {
              return res.status(400).json({ message: 'Username already taken' });
          }
          if (existingUser.email === email) {
              return res.status(400).json({ message: 'Email already registered' });
          }
      }

      const user = new User({
          username,
          walletAddress,
          email
      });

      const savedUser = await user.save();
      res.status(201).json({ user: savedUser });
  } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Registration failed. Please try again.' });
  }
};
