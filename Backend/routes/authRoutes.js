import express from 'express';
import { register, login, changePassword, verifyToken } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/changePassword', protect, changePassword);
router.post('/verify-token', protect, verifyToken);

export default router;