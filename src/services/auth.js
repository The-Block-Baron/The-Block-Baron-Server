import Player from '../models/player.model.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';

// Validation middleware
export const validateRegistration = [
    body('username').isString().withMessage('Username must be a string').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const validateLogin = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];


dotenv.config();


export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
        return res.status(400).json({ message: 'Email already in use by another player' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({ message: 'Email already in use by an admin' });
    }

    const player = new Player({
        username,
        email,
        password,
    });

    try {
        const savedPlayer = await player.save();
        res.status(201).json({ player: savedPlayer });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};






export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const player = await Player.findOne({ email });
    if (!player) {
        return res.status(400).json({ message: 'Player not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, player.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const playerForToken = {
        id: player._id,
        username: player.username
    };

    const token = jwt.sign(playerForToken, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });

    res.status(200).json({ player });
    console.log('Login successful');
};
