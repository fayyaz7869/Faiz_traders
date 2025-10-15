import express from 'express';
import { loginAdmin } from '../controllers/adminController.js';
import { validateLogin } from '../middlewares/validatorMiddleware.js';

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Authenticate admin and get token
// @access  Public
router.post('/login', validateLogin, loginAdmin);

export default router;

