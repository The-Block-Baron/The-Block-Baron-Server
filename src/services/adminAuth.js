import Admin from '../models/admin.model.js';
import Player from '../models/player.model.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';

// Validation middleware
export const validateAdminRegistration = [
    body('username').isString().withMessage('Username must be a string').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const validateAdminLogin = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Initialize dotenv
dotenv.config();

// Admin Registration logic
export const adminRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Verificar si el email ya existe en los registros de Admin
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({ message: 'Email already in use by another admin' });
    }

    // Verificar si el email ya existe en los registros de Player
    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
        return res.status(400).json({ message: 'Email already in use by a player' });
    }

    const admin = new Admin({
        username,
        email,
        password,
    });

    try {
        const savedAdmin = await admin.save();
        const adminForToken = {
            id: savedAdmin._id,
            username: savedAdmin.username,
        };
        
        const token = jwt.sign(adminForToken, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ admin: savedAdmin, token });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};


// Admin Login logic
export const adminLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
        return res.status(400).json({ message: 'Admin not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const adminForToken = {
        id: admin._id,
        username: admin.username
    };

    const token = jwt.sign(adminForToken, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ admin, token });
    console.log('Admin login successful');
};
