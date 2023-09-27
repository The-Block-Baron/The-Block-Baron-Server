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


dotenv.config();

export const adminRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({ message: 'Email already in use' });
    }

    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
        return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
        username,
        email,
        password: hashedPassword,
    });

    try {
        const savedAdmin = await admin.save();
        res.status(201).json({ message: 'Admin registration successful', admin: { id: savedAdmin._id, username: savedAdmin.username } });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};



export const adminLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
        console.error('Invalid credentials attempt');
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
        console.error('Invalid credentials attempt');
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const adminForToken = {
        id: admin._id,
        username: admin.username
    };

    const token = jwt.sign(adminForToken, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

    res.status(200).json({ admin: { id: admin._id, username: admin.username } });
    console.log('Admin login successful');
};
