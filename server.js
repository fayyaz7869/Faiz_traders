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
import path from 'path';
import { fileURLToPath } from 'url';

import logger from './utils/logger.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// --- CRITICAL FIX FOR RENDER DEPLOYMENT ---
// This tells Express to trust the proxy that Render uses.
// It must be set for express-rate-limit to work correctly in production.
app.set('trust proxy', 1);

// --- Middlewares ---
app.use(cors());
app.use(helmet());
app.use(express.json());

const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many orders created from this IP, please try again after 15 minutes',
});

// --- 1. API Routes (MUST COME FIRST) ---
app.use('/api/orders', orderLimiter, orderRoutes);
app.use('/api/admin', adminRoutes);

// --- 2. SERVE REACT FRONTEND (MUST COME AFTER API ROUTES) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    // Correct path to the build folder
    const buildPath = path.resolve(__dirname, 'client', 'dist');

    // **CRITICAL FIX**: Serve static files (CSS, JS, images) from the build folder
    app.use(express.static(buildPath));

    // The "catch-all" handler: for any request that doesn't match one above,
    // send back React's index.html file. This MUST come after express.static.
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(buildPath, 'index.html'));
    });
}

// --- 3. ERROR HANDLERS (MUST COME LAST) ---
app.use((req, res, next) => {
    res.status(404).json({ message: "API route not found" });
});

app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ message: 'An internal server error occurred' });
});

// --- Server Startup ---
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

