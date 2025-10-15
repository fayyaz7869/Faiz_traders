import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const loginAdmin = async (req, res) => {
    try {
        const { password } = req.body;

        if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
            logger.error('Admin password or JWT secret is not configured in .env file.');
            return res.status(500).json({ message: 'Server configuration error.' });
        }
        
        // --- MODIFICATION FOR ROBUSTNESS ---
        // Trim whitespace from the password stored in the .env file.
        const storedAdminPassword = process.env.ADMIN_PASSWORD.trim();

        if (!password || password !== storedAdminPassword) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Credentials are valid, create a JWT
        const token = jwt.sign(
            { user: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({ token });

    } catch (error) {
        logger.error(`Admin login failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

