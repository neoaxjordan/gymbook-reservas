import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateUserCreate } from '../middleware/validation/user.validator';

const router = Router();

// endpoint de authentication
router.post('/login', authController.login);
router.post('/register', validateUserCreate, authController.register);

export default router;