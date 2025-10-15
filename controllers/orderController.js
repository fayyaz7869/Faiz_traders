// import { validationResult } from 'express-validator';
// import { appendOrder, getOrders } from '../utils/sheetsApi.js'; // Using your file name
// import logger from '../utils/logger.js';
// import crypto from 'crypto';

// /**
//  * Generates a unique Order ID.
//  * Example: ORD-20251015-A1B2C
//  */
// const generateOrderId = () => {
//     const date = new Date();
//     const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
//     const randomString = crypto.randomBytes(3).toString('hex').toUpperCase();
//     return `ORD-${dateString}-${randomString}`;
// };

// export const createOrder = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const orderId = generateOrderId();
//         const { customerName, customerPhone, customerAddress, items, totalAmount, language } = req.body;

//         const newOrder = {
//             orderId,
//             orderDate: new Date().toISOString(),
//             customerName,
//             customerPhone,
//             customerAddress,
//             itemsJson: JSON.stringify(items),
//             totalAmount,
//             language: language || 'en',
//             status: 'Pending',
//         };

//         await appendOrder(newOrder);

//         logger.info(`Successfully created order ${orderId}`);
//         res.status(201).json({ orderId: newOrder.orderId, status: 'OK' });

//     } catch (error) {
//         // --- MODIFICATION FOR BETTER DEBUGGING ---
//         // Now this will contain the more specific error from the sheets utility
//         logger.error(`Error creating order: ${error.message}`, { stack: error.stack });
//         res.status(500).json({ message: 'Failed to create order.', error: error.message });
//     }
// };

// export const getAllOrders = async (req, res) => {
//     try {
//         const orders = await getOrders();
//         res.status(200).json(orders);
//     } catch (error) {
//         logger.error(`Error fetching orders: ${error.message}`, { stack: error.stack });
//         res.status(500).json({ message: 'Failed to retrieve orders.' });
//     }
// };

import { validationResult } from 'express-validator';
import { appendOrder, getOrders } from '../utils/sheetsApi.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

/**
 * Generates a unique Order ID.
 */
const generateOrderId = () => {
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomString = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `ORD-${dateString}-${randomString}`;
};

export const createOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const orderId = generateOrderId();
        // Destructure 'items' from the request body along with other customer details
        const { customerName, customerPhone, customerAddress, items, totalAmount, language } = req.body;

        // --- FIX APPLIED HERE ---
        // The 'items' array from the request body is now correctly included
        // in the newOrder object that gets passed to the appendOrder function.
        const newOrder = {
            orderId,
            orderDate: new Date().toISOString(),
            customerName,
            customerPhone,
            customerAddress,
            items: items, // <-- THIS LINE WAS MISSING
            totalAmount,
            language: language || 'en',
            // The status is set on the backend, not taken from the frontend
            status: 'Pending', 
        };

        await appendOrder(newOrder);

        logger.info(`Successfully created order ${orderId}`);
        res.status(201).json({ orderId: newOrder.orderId, status: 'OK' });

    } catch (error) {
        logger.error(`Error creating order: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: 'Failed to create order.', error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await getOrders();
        res.status(200).json({ orders }); // <-- Wrap the response in an object
    } catch (error) {
        logger.error(`Error fetching orders: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: 'Failed to retrieve orders.' });
    }
};

