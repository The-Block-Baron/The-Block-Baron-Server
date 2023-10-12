import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const playerDetails = async (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userWalletAddress = decoded.walletAddress;
    const userName = decoded.username;
    
    res.json({ walletAddress: userWalletAddress, username: userName });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
