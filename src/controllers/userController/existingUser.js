import { validationResult } from 'express-validator';

export const checkExistingUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email } = req.body;

    const existingUser = await User.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    });

    if (existingUser) {
        if (existingUser.username === username) {
            return res.status(400).json({ message: 'Username already taken' });
        } else if (existingUser.email === email) {
            return res.status(400).json({ message: 'Email already registered' });
        }
    } else {
        return res.status(200).json({ canConnect: true });
    }
};
