import rateLimit from "express-rate-limit";
import logger from '../utils/logger.js';
/**
 * Basic rate limiting middleware for public endpoints like POST /api/orders
 * Allows 5 requests per 1 minute per IP.
 */
const orderLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip} on route ${req.path}`);
        return res.status(429).json({
            error: true,
            message: 'Too many requests from this IP, please try again after a minute.',
        });
    },
});

module.exports = {
    orderLimiter,
};