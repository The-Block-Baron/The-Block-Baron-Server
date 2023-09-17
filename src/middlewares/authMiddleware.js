import jwt from 'jsonwebtoken';
import Player from '../models/player.model.js';

const playerAuthMiddleware = async (req, res, next) => {
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
        
        const player = await Player.findById(decodedToken.id);
      
        if (!player) {
          return res.status(401).json({ message: 'Player not found' });
        }

        req.user = {
          role: 'player',
          id: player._id,
        };
      
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'An internal server error occurred' });
    }
};

export default playerAuthMiddleware;
