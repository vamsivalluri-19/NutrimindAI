import { Router } from 'express';
import { login, register, otpLoginRequest, otpLoginVerify, refreshToken, verifyEmail, googleLogin } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { RegisterSchema, LoginSchema, OtpLoginSchema } from '@nutrimind/shared';

const router = Router();

router.post('/register', validateBody(RegisterSchema), register);
router.post('/login', validateBody(LoginSchema), login);
router.post('/google', googleLogin);
router.post('/otp-request', validateBody(OtpLoginSchema.pick({ phone: true })), otpLoginRequest);
router.post('/otp-verify', validateBody(OtpLoginSchema), otpLoginVerify);
router.post('/refresh-token', refreshToken);
router.get('/verify-email', verifyEmail);

export default router;
