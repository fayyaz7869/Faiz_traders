// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import logger from './utils/logger.js';

// // Import routes
// import orderRoutes from './routes/orderRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';

// const app = express();
// const PORT = process.env.PORT || 3000;

// // --- Middleware ---
// app.use(cors());
// app.use(helmet());
// app.use(express.json());

// const orderLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 20,
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: 'Too many orders created from this IP, please try again after 15 minutes',
// });

// // --- Routes ---
// app.use((req, res, next) => {
//     logger.info(`${req.method} ${req.originalUrl}`);
//     next();
// });

// app.use('/api/orders', orderLimiter, orderRoutes);
// app.use('/api/admin', adminRoutes);

// app.get('/', (req, res) => {
//     res.send('Order Management Backend is running.');
// });

// // --- Error Handling ---
// app.use((req, res, next) => {
//     res.status(404).json({ message: 'Not Found' });
// });

// app.use((err, req, res, next) => {
//     logger.error(`Error: ${err.message}`, { stack: err.stack });
//     res.status(500).json({ message: 'An internal server error occurred' });
// });

// // --- Server Startup ---
// app.listen(PORT, () => {
//     logger.info(`Server is running on http://localhost:${PORT}`);
//     if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
//         logger.warn('WARNING: GOOGLE_SERVICE_ACCOUNT_KEY is not set in .env file. Google Sheets API will not work.');
//     }
// });
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js';

// Import routes
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---

// Enable CORS
app.use(cors());

// Set security-related HTTP headers
app.use(helmet());

// Parse incoming JSON requests
app.use(express.json());

// Rate limiter for order creation to prevent abuse
const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many orders created from this IP, please try again after 15 minutes',
});

// --- Routes ---

// Log all incoming requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});

// Use the defined routes
// Note: Applying the limiter directly to the router
app.use('/api/orders', orderLimiter, orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Order Management Backend is running.');
});

// --- Error Handling ---

// 404 Not Found handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

// General error handler
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ message: 'An internal server error occurred' });
});

// --- Server Startup ---

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});

