import RefreshToken from "../models/refreshToken.model.js";

export const logout = async (req, res) => {
    try {
        
        res.clearCookie('token');

        const refreshTokenFromCookie = req.cookies.refreshToken;

        if (refreshTokenFromCookie) {
            await RefreshToken.findOneAndDelete({ token: refreshTokenFromCookie });
            res.clearCookie('refreshToken');
        }

        res.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
