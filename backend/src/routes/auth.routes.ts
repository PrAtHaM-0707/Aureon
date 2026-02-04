import express from 'express';
import { register, login, getMe, changePassword, deleteAccount, updateProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, changePasswordSchema, updateProfileSchema } from '../schemas/auth.schema';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.patch('/update-profile', protect, validate(updateProfileSchema), updateProfile);
router.patch('/change-password', protect, validate(changePasswordSchema), changePassword);
router.delete('/delete-account', protect, deleteAccount);

export default router;