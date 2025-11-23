import express from 'express';
import * as authController from '../controllers/authController.js';
import { validate, registerSchema, loginSchema } from '../middleware/validate.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticateUser, authController.me);

export default router;
