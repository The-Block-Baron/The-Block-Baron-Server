import User from "../../models/user.model.js";

export const isUserRegistered = async (req, res) => {

    try {
        const { walletAddress } = req.body; 

        if (!walletAddress) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        const user = await User.findOne({ walletAddress });
        console.log('User from database:', user);

        if (user) {
            return res.status(200).json({ isRegistered: true });
        } else {
            return res.status(200).json({ isRegistered: false });
        }
    } catch (error) {
        console.error('Error checking user registration:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};