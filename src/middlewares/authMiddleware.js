import jwt from 'jsonwebtoken';
import Player from '../models/player.model.js';
import Admin from '../models/admin.model.js';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Search in Players
        const player = await Player.findById(decodedToken.id);
        
        // Search in Admins
        const admin = await Admin.findById(decodedToken.id);

        if (!player && !admin) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (player) {
            req.user = {
                role: 'player',
                id: player._id,
            };
        } else if (admin) {
            req.user = {
                role: 'admin',
                id: admin._id,
            };
        }

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'An internal server error occurred' });
    }
};

export default authMiddleware;
