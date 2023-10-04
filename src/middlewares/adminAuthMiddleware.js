import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

const adminAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        const admin = await Admin.findById(decodedToken.id);
      
        if (!admin) {
          return res.status(401).json({ message: 'Admin not found' });
        }

        req.user = {
          role: 'admin',
          id: admin._id,
        };
      
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'An internal server error occurred' });
    }
};

export default adminAuthMiddleware;
