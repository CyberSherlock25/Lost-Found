import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import {
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  validateEmail,
  validateOtp,
  validatePassword,
} from '../utils/validation';

interface ForgotPasswordErrors {
  email?: string;
  otpCode?: string;
  newPassword?: string;
}

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] =
    useState<ForgotPasswordErrors>({});

  const navigate = useNavigate();

  const handleRequestOtp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const emailError = validateEmail(email);

    if (emailError) {
      setErrors({ email: emailError });
      toast.error(emailError);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await api.post(
        '/auth/forgot-password',
        {
          email: email.trim(),
        }
      );

      toast.success(
        res.data.message ||
          'OTP sent to your email'
      );

      setStep(2);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Failed to request OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const otpError = validateOtp(otpCode);
    const passwordError = validatePassword(
      newPassword,
      'New password'
    );

    const newErrors: ForgotPasswordErrors = {};

    if (otpError) {
      newErrors.otpCode = otpError;
    }

    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please correct the highlighted fields.');
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        email: email.trim(),
        otpCode: otpCode.trim(),
        newPassword,
      });

      toast.success(
        'Password reset successfully! Please log in.'
      );

      navigate('/login');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Failed to reset password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-100">
            Password Recovery
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            {step === 1
              ? 'Enter your university email to receive a security OTP'
              : 'Enter the OTP and your new password'}
          </p>
        </div>

        {step === 1 ? (
          <form
            onSubmit={handleRequestOtp}
            className="space-y-4"
            noValidate
          >
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
              >
                University Email
              </label>

              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (errors.email) {
                      setErrors((prev) => ({
                        ...prev,
                        email: undefined,
                      }));
                    }
                  }}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs ${
                    errors.email
                      ? 'border-rose-500/70'
                      : ''
                  }`}
                  placeholder="student@university.edu"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-[11px] text-rose-400">
                  {errors.email}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-btn text-xs font-bold text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Sending OTP...'
                : 'Send Security OTP'}

              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleResetPassword}
            className="space-y-4"
            noValidate
          >
            <div>
              <label
                htmlFor="otp-code"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
              >
                6-Digit OTP Code
              </label>

              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ''
                      );

                    setOtpCode(value);

                    if (errors.otpCode) {
                      setErrors((prev) => ({
                        ...prev,
                        otpCode: undefined,
                      }));
                    }
                  }}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs tracking-widest font-mono text-center ${
                    errors.otpCode
                      ? 'border-rose-500/70'
                      : ''
                  }`}
                  placeholder="123456"
                  aria-invalid={Boolean(errors.otpCode)}
                />
              </div>

              {errors.otpCode && (
                <p className="mt-1 text-[11px] text-rose-400">
                  {errors.otpCode}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
              >
                New Password
              </label>

              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);

                    if (errors.newPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        newPassword: undefined,
                      }));
                    }
                  }}
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl glass-input text-xs ${
                    errors.newPassword
                      ? 'border-rose-500/70'
                      : ''
                  }`}
                  placeholder="Create a new password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(
                    errors.newPassword
                  )}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errors.newPassword && (
                <p className="mt-1 text-[11px] text-rose-400">
                  {errors.newPassword}
                </p>
              )}

              <p className="mt-1 text-[10px] text-slate-500">
                Minimum 8 characters with uppercase, lowercase,
                and a number.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-btn text-xs font-bold text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Resetting...'
                : 'Update Password'}

              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};