import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, Mail, Lock, Phone } from 'lucide-react';
import api from '../services/api';

export default function LoginPage() {
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

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
  }, [isOtpMode]);

  const handleGoogleCredentialResponse = async (response: any) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/google', { token: response.credential });
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userRole', data.user.role);
      checkProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      if (isOtpMode) {
        if (!otpSent) {
          const { data } = await api.post('/auth/otp-request', { phone });
          setOtpSent(true);
          setInfo(`Mock OTP code generated in console log: ${data.mockOtp}`);
        } else {
          const { data } = await api.post('/auth/otp-verify', { phone, otp });
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('userRole', data.user.role);
          checkProfile();
        }
      } else {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('userRole', data.user.role);
        checkProfile();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const checkProfile = async () => {
    const role = localStorage.getItem('userRole');
    if (role === 'NUTRITIONIST' || role === 'TRAINER') {
      navigate('/dashboard');
      return;
    }
    try {
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
      
      <div className="w-full max-w-md glass p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} />
            <span>NutriMind Security</span>
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {isOtpMode ? 'OTP Login' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Sign in to access your dashboard and health coaches.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-2xl text-xs text-red-500 text-center font-semibold">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/25 rounded-2xl text-xs text-blue-500 text-center font-semibold">
            {info}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {isOtpMode ? (
            <>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Verification Code (OTP)</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white text-center font-mono tracking-widest text-lg"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
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
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 hover:scale-[1.01]"
          >
            {loading ? 'Processing...' : isOtpMode ? (otpSent ? 'Verify & Login' : 'Request OTP') : 'Sign In'}
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

        <div className="space-y-3 text-center text-xs">
          <button
            onClick={() => navigate('/register')}
            className="text-primary hover:underline font-bold block mx-auto text-sm"
          >
            Don't have an account? Sign Up
          </button>
          
          <button
            onClick={() => {
              setIsOtpMode(!isOtpMode);
              setOtpSent(false);
              setError('');
              setInfo('');
            }}
            className="text-slate-400 hover:text-slate-200 font-semibold block mx-auto"
          >
            {isOtpMode ? 'Switch to Email Sign In' : 'Sign In with Phone OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}
