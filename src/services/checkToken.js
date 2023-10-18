import jwt from 'jsonwebtoken';

export const checkToken = async (req, res) => {
    try {
        // Asumiendo que estás enviando el token en una cookie llamada 'accessToken'
        const token = req.cookies.accessToken;

        // Si no hay token, devuelve un error
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verifica el token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Failed to authenticate token' });
            }

            res.status(200).json({
                user: {
                    id: decoded.id,
                    username: decoded.username,
                    walletAddress: decoded.walletAddress
                }
            });
        });
    } catch (error) {
        console.error('Error during token check:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
