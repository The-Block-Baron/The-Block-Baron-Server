import User from '../models/user.model.js';  // <-- Import User model
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


  const existingUserByWallet = await User.findOne({ walletAddress });
  if (existingUserByWallet) {
      return res.status(400).json({ message: 'Wallet address already registered' });
  }


  const existingUserByUsername = await User.findOne({ username });
  if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already taken' });
  }


  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already registered' });
  }

  const user = new User({
      username,
      walletAddress,
      email
  });

  try {
      const savedUser = await user.save();
      res.status(201).json({ user: savedUser });
  } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
  }
};
