import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { MailService } from '../services/mail.service';
import axios from 'axios';

const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'supersecretjwtsecretkey12345!',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshsecretkey67890!',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET || 'supersecretjwtsecretkey12345!', { expiresIn: '24h' });

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || 'USER',
    });

    await newUser.save();
    await MailService.sendVerificationEmail(email, verificationToken);

    const { accessToken, refreshToken } = generateTokens(newUser);

    res.status(201).json({
      message: 'Registration successful. Verification email sent.',
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const otpLoginRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;
    // Mock OTP dispatch
    const mockOtp = '123456';
    console.log(`[SMS Mock] OTP code for ${phone}: ${mockOtp}`);
    res.json({ message: 'OTP sent successfully', mockOtp });
  } catch (error) {
    next(error);
  }
};

export const otpLoginVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, otp } = req.body;
    if (otp !== '123456') {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    // Attempt to match or generate mock profile
    let user = await User.findOne({ email: `${phone}@nutrimind.ai` });
    if (!user) {
      user = new User({
        firstName: 'Quick',
        lastName: 'User',
        email: `${phone}@nutrimind.ai`,
        role: 'USER',
        isPhoneVerified: true,
      });
      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user);
    res.json({
      message: 'Login successful via OTP',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshsecretkey67890!') as any;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User session no longer exists' });
    }

    const tokens = generateTokens(user);
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const decoded = jwt.verify(token as string, process.env.JWT_SECRET || 'supersecretjwtsecretkey12345!') as any;
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token or user does not exist' });
    }

    user.isEmailVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Expired or invalid verification token' });
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Google ID token is required' });
    }

    let googleUser;
    try {
      const { data } = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      googleUser = data;
    } catch (err: any) {
      console.error('Google token verification failed:', err.message);
      return res.status(400).json({ message: 'Invalid or expired Google token' });
    }

    const { email, given_name, family_name } = googleUser;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        firstName: given_name || 'Google',
        lastName: family_name || 'User',
        role: 'USER',
        isEmailVerified: true
      });
      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      message: 'Google login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
