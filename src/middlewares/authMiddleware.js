import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const userAuthMiddleware = async (req, res, next) => {
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
        
        const user = await User.findById(decodedToken.id);
      
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        req.user = {
          role: 'user',
          id: user._id,
        };
      
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'An internal server error occurred' });
    }
};

export default userAuthMiddleware;
