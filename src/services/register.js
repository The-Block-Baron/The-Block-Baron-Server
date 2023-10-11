import Player from '../models/player.model.js';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('username').isString().withMessage('Username must be a string').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
  body('walletAddress').isString().isLength({ min: 42, max: 42 }).withMessage('Invalid Ethereum wallet address'),
];

dotenv.config();

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { username, walletAddress } = req.body;

  const existingPlayerByWallet = await Player.findOne({ walletAddress });
  if (existingPlayerByWallet) {
      return res.status(400).json({ message: 'Wallet address already registered' });
  }

  const existingPlayerByUsername = await Player.findOne({ username });
  if (existingPlayerByUsername) {
      return res.status(400).json({ message: 'Username already taken' });
  }

  const player = new Player({
      username,
      walletAddress,
  });

  try {
      const savedPlayer = await player.save();
      res.status(201).json({ player: savedPlayer });
  } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
  }
};