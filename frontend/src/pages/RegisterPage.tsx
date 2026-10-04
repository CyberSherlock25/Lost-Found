import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  validateRegistrationForm,
  ValidationErrors,
} from '../utils/validation';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    universityId: '',
    roleId: 4,
    departmentId: 1,
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const updateField = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = validateRegistrationForm({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword,
      phone: formData.phone,
      universityId: formData.universityId,
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please correct the highlighted fields.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        universityId: formData.universityId.trim(),
        roleId: 4,
      });

      toast.success(
        'Registration successful! Please login.'
      );

      navigate('/login');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full py-2.5 rounded-xl glass-input text-xs ${
      errors[field]
        ? 'border-rose-500/70 focus:border-rose-500'
        : ''
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_35%),#020b14]">
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="w-full max-w-5xl grid lg:grid-cols-[0.95fr_1.05fr] rounded-[24px] sm:rounded-[32px] border border-slate-700/80 bg-slate-950/70 shadow-[0_40px_100px_-35px_rgba(14,165,233,0.4)] overflow-hidden relative z-10 backdrop-blur-xl">

        <div className="hidden lg:flex flex-col justify-between p-10 bg-[linear-gradient(160deg,rgba(15,23,42,0.96),rgba(12,18,30,0.84),rgba(13,81,87,0.15))] border-r border-slate-800">
          <div>
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-teal-500 flex items-center justify-center text-white font-black shadow-xl shadow-sky-500/25">
                LF
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-sky-300 font-bold">
                  University ERP
                </p>

                <h1 className="text-lg font-black text-slate-100 tracking-[0.18em]">
                  LOST & FOUND
                </h1>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Registration
                </p>

                <h2 className="mt-2 text-4xl font-black leading-tight text-white">
                  Create a secure student profile.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-slate-300">
                Open access to the campus item recovery workflow
                with a verified identity, secure credentials, and
                structured student profile data.
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {[
              'Student identity verification',
              'Recovery claim access',
              'Secure campus operations profile',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-3 text-sm text-slate-200"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.9)]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-slate-950/70">
          <div className="mb-6 text-center lg:text-left">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Create account
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
              Register student profile
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label
                  htmlFor="first-name"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
                >
                  First Name
                </label>

                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="first-name"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      updateField(
                        'firstName',
                        e.target.value
                      )
                    }
                    className={`${inputClass(
                      'firstName'
                    )} pl-9 pr-4`}
                    placeholder="John"
                    autoComplete="given-name"
                    aria-invalid={Boolean(errors.firstName)}
                  />
                </div>

                {errors.firstName && (
                  <p className="mt-1 text-[11px] text-rose-400">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="last-name"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
                >
                  Last Name
                </label>

                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="last-name"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      updateField(
                        'lastName',
                        e.target.value
                      )
                    }
                    className={`${inputClass(
                      'lastName'
                    )} pl-9 pr-4`}
                    placeholder="Doe"
                    autoComplete="family-name"
                    aria-invalid={Boolean(errors.lastName)}
                  />
                </div>

                {errors.lastName && (
                  <p className="mt-1 text-[11px] text-rose-400">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
              >
                University Email
              </label>

              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="register-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    updateField(
                      'email',
                      e.target.value
                    )
                  }
                  className={`${inputClass(
                    'email'
                  )} pl-9 pr-4`}
                  placeholder="john.doe@university.edu"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label
                  htmlFor="university-id"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
                >
                  University ID
                </label>

                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="university-id"
                    type="text"
                    value={formData.universityId}
                    onChange={(e) =>
                      updateField(
                        'universityId',
                        e.target.value
                      )
                    }
                    className={`${inputClass(
                      'universityId'
                    )} pl-9 pr-4`}
                    placeholder="STD-2026-101"
                    autoComplete="off"
                    aria-invalid={Boolean(
                      errors.universityId
                    )}
                  />
                </div>

                {errors.universityId && (
                  <p className="mt-1 text-[11px] text-rose-400">
                    {errors.universityId}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="register-phone"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="register-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      updateField(
                        'phone',
                        e.target.value
                      )
                    }
                    className={`${inputClass(
                      'phone'
                    )} pl-9 pr-4`}
                    placeholder="+919876543210"
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                  />
                </div>

                {errors.phone && (
                  <p className="mt-1 text-[11px] text-rose-400">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
              >
                Department
              </label>

              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <select
                  id="department"
                  value={formData.departmentId}
                  onChange={(e) =>
                    updateField(
                      'departmentId',
                      Number(e.target.value)
                    )
                  }
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
                >
                  <option value={1}>
                    Computer Science
                  </option>
                  <option value={2}>MCA</option>
                  <option value={3}>MBA</option>
                  <option value={4}>Electronics</option>
                  <option value={5}>Mechanical</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    updateField(
                      'password',
                      e.target.value
                    )
                  }
                  className={`${inputClass(
                    'password'
                  )} pl-9 pr-10`}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
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

              <p className="mt-1 text-[10px] text-slate-500">
                Minimum 8 characters with uppercase, lowercase,
                and a number.
              </p>

              {errors.password && (
                <p className="mt-1 text-[11px] text-rose-400">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);

                    if (errors.confirmPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }
                  }}
                  className={`${inputClass(
                    'confirmPassword'
                  )} pl-9 pr-4`}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(
                    errors.confirmPassword
                  )}
                />
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 text-[11px] text-rose-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-[10px] text-slate-300">
              Account type: Student (self-registration is
              restricted to student access only).
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl gradient-btn text-xs font-bold text-white shadow-[0_18px_30px_-18px_rgba(14,165,233,0.8)] flex items-center justify-center gap-2 mt-6 transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading
                ? 'Creating Account...'
                : 'Complete Registration'}

              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-sky-300 hover:text-sky-200 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};