import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, Mail, Lock, User, Phone } from 'lucide-react';
import api from '../services/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const navigate = useNavigate();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      if (isOtpMode) {
        if (!otpSent) {
          // Request OTP
          const { data } = await api.post('/auth/otp-request', { phone });
          setOtpSent(true);
          setInfo(`Mock OTP code generated in console log: ${data.mockOtp}`);
        } else {
          // Verify OTP
          const { data } = await api.post('/auth/otp-verify', { phone, otp });
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          checkProfile();
        }
      } else if (isLogin) {
        // Normal Login
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        checkProfile();
      } else {
        // Register
        const { data } = await api.post('/auth/register', { email, password, firstName, lastName, role: 'USER' });
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setInfo(data.message);
        setTimeout(() => {
          checkProfile();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if ((window as any).google && clientID) {
      (window as any).google.accounts.id.initialize({
        client_id: clientID,
        callback: handleGoogleCredentialResponse
      });
      (window as any).google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        { theme: "outline", size: "large", width: 380 }
      );
    }
  }, [isLogin]);

  const handleGoogleCredentialResponse = async (response: any) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/google', { token: response.credential });
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      checkProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const checkProfile = async () => {
    try {
      // Check if user has completed onboarding profile setup
      await api.get('/users/profile');
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 404) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 relative">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
      
      <div className="w-full max-w-md glass p-8 rounded-3xl shadow-xl dark:shadow-slate-950/20 border border-slate-200/50 dark:border-slate-800/50">
        <div className="text-center mb-8">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} />
            <span>NutriMind AI Engine</span>
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {isOtpMode ? 'OTP Login' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {isOtpMode ? 'Verify with your phone number' : isLogin ? 'Sign in to access your AI coaches' : 'Start your healthy lifestyle journey today'}
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold">
            {error}
          </div>
        )}

        {info && (
          <div className="p-4 mb-6 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            {info}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-5">
          {/* OTP Mode Fields */}
          {isOtpMode ? (
            <>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="Phone Number (e.g. +1234567890)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                />
              </div>

              {otpSent && (
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP (123456)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </>
          ) : (
            // standard Login / Register fields
            <>
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 hover:scale-[1.01]"
          >
            {loading ? 'Processing...' : isOtpMode ? (otpSent ? 'Verify & Login' : 'Request OTP') : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6 text-center text-xs text-slate-400 uppercase tracking-widest">
          <div className="absolute inset-y-1/2 left-0 right-0 border-t border-slate-200 dark:border-slate-800 -z-10" />
          <span className="bg-slate-50 dark:bg-slate-900 px-3">or connect with</span>
        </div>

        <div className="flex flex-col space-y-3 mb-6">
          <div id="googleButton" className="w-full flex justify-center"></div>
          <button
            onClick={() => {
              localStorage.setItem('token', 'mock_apple_token');
              checkProfile();
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/30 hover:bg-white/80 dark:bg-slate-900/30 dark:hover:bg-slate-900 text-sm font-semibold transition-all text-slate-700 dark:text-slate-200"
          >
            <span>Apple Login (Mock)</span>
          </button>
        </div>

        <div className="space-y-2 text-center text-sm">
          {!isOtpMode && (
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setInfo('');
              }}
              className="text-primary hover:underline font-semibold block mx-auto"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </button>
          )}

          <button
            onClick={() => {
              setIsOtpMode(!isOtpMode);
              setOtpSent(false);
              setOtp('');
              setError('');
              setInfo('');
            }}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white text-xs underline font-medium"
          >
            {isOtpMode ? 'Switch to Email Authentication' : 'Sign in with Mobile OTP instead'}
          </button>
        </div>
      </div>
    </div>
  );
}
