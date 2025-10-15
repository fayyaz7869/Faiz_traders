import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.warn(`JWT verification failed: ${err.message}`);
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};

