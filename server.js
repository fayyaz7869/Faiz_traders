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
import path from 'path'; // <-- Added for handling file paths
import { fileURLToPath } from 'url'; // <-- Added for handling file paths

import logger from './utils/logger.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
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

// --- API Routes (Must come first) ---
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api/orders', orderLimiter, orderRoutes);
app.use('/api/admin', adminRoutes);


// --- PRODUCTION: SERVE REACT FRONTEND ---
// This new section is the key to making your frontend work.
// It must come AFTER your API routes but BEFORE your error handlers.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This block only runs in production environments like Render
if (process.env.NODE_ENV === 'production') {
    // 1. Serve static files (like CSS, JS, images) from the React build folder
    const buildPath = path.resolve(__dirname, 'client', 'dist');
    app.use(express.static(buildPath));

    // 2. The "catch-all" handler: for any request that doesn't match the API or a static file,
    // send back React's index.html file. This allows React Router to handle page navigation.
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(buildPath, 'index.html'));
    });
} else {
    // This will only run in development, so you know the backend is active.
    app.get('/', (req, res) => {
        res.send('Order Management Backend is running in Development Mode.');
    });
}


// --- Error Handling (Must come last) ---
app.use((req, res, next) => {
    // This will now only catch requests for API routes that don't exist
    res.status(404).json({ message: 'API Route Not Found' });
});

app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ message: 'An internal server error occurred' });
});

// --- Server Startup ---
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});

