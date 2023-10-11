import Player from '../models/player.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import { ethers } from 'ethers';
import RefreshToken from '../models/refreshToken.model.js';  // Asegúrate de importar el modelo de token de actualización

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

      const player = await Player.findOne({ walletAddress });
      if (!player) {
          return res.status(400).json({ message: 'Player not found' });
      }

      const recoveredAddress = ethers.utils.verifyMessage(originalMessage, signedMessage);
      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
          return res.status(400).json({ message: 'Signature verification failed' });
      }

      const playerForToken = {
          id: player._id,
          username: player.username,
          walletAddress: player.walletAddress
      };


      const accessToken = jwt.sign(playerForToken, process.env.JWT_SECRET, { expiresIn: '30m' });


      const refreshToken = jwt.sign(playerForToken, process.env.REFRESH_TOKEN_SECRET);
      const newRefreshToken = new RefreshToken({
          token: refreshToken,
          user: player._id,
          expiryDate: new Date(Date.now() + 7*24*60*60*1000)
      });
      await newRefreshToken.save();

      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 7*24*60*60*1000 });
      res.status(200).json({ accessToken, player });

      console.log('Login successful');
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};
