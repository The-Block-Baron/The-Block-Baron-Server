import Player from '../models/player.model';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { body, validationResult } from 'express-validator';

export const validateRegistration = [
    body('username').isString().withMessage('Username must be a string').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]

export const validateLogin = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]


dotenv.config()


export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const existingUser = await Player.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' })
    }

    const user = new User({
        username,
        email,
        password,
    });

    try {
        const savedUser = await user.save()
        const userForToken = {
            id: savedUser._id,
            username: savedUser.username, 
        }
        const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(201).json({ user: savedUser, token })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};


export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body

    const user = await User.findOne({email})
    if(!user) {
        return res.status(400).json({message: 'User not found'})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect) {
        return res.status(400).json({message: 'Invalid Password'})
    }

    const userForToken = {
        id: user._id,
        username: user.username
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {expiresIn:'1h'})

    res.status(200).json({user, token})
    console.log('Login successful')

}