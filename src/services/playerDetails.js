import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const playerDetails = async (req, res) => {
  const token = req.cookies.accessToken; 
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { iat, exp, ...userDetails } = decoded;
    
    res.json(userDetails);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
