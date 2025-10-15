import express from 'express';
import { createOrder, getAllOrders } from '../controllers/orderController.js';
import { validateOrder } from '../middlewares/validatorMiddleware.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/', validateOrder, createOrder);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private (Admin only)
router.get('/', authenticateToken, getAllOrders);

export default router;

