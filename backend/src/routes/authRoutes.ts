import { Router } from 'express';
import { login, profile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.get('/profile', authenticate, profile);

export default router;
