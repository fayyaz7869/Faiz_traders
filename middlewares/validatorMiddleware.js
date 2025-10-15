import { body } from 'express-validator';

export const validateOrder = [
    body('customerName').notEmpty().withMessage('Customer name is required.').trim().escape(),
    body('customerPhone').notEmpty().withMessage('Customer phone is required.').trim().escape(),
    body('customerAddress').notEmpty().withMessage('Customer address is required.').trim().escape(),
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item.'),
    body('items.*.name').notEmpty().withMessage('Item name is required.').trim().escape(),
    body('items.*.quantity').isInt({ gt: 0 }).withMessage('Item quantity must be a positive integer.'),
    body('totalAmount').isFloat({ gt: 0 }).withMessage('Total amount must be a positive number.'),
    body('language').optional().trim().escape(),
];

export const validateLogin = [
    body('password').notEmpty().withMessage('Password is required.'),
];

