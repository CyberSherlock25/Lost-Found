import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, CreditCard, Building2, ArrowRight, Eye, EyeOff } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        ...formData,
        roleId: 4,
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_35%),#020b14]">
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="w-full max-w-5xl grid lg:grid-cols-[0.95fr_1.05fr] rounded-[32px] border border-slate-700/80 bg-slate-950/70 shadow-[0_40px_100px_-35px_rgba(14,165,233,0.4)] overflow-hidden relative z-10 backdrop-blur-xl">
        <div className="hidden lg:flex flex-col justify-between p-10 bg-[linear-gradient(160deg,rgba(15,23,42,0.96),rgba(12,18,30,0.84),rgba(13,81,87,0.15))] border-r border-slate-800">
          <div>
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-teal-500 flex items-center justify-center text-white font-black shadow-xl shadow-sky-500/25">LF</div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-sky-300 font-bold">University ERP</p>
                <h1 className="text-lg font-black text-slate-100 tracking-[0.18em]">LOST & FOUND</h1>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Registration</p>
                <h2 className="mt-2 text-4xl font-black leading-tight text-white">Create a secure student profile.</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-slate-300">
                Open access to the campus item recovery workflow with a verified identity, secure credentials, and structured student profile data.
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {['Student identity verification', 'Recovery claim access', 'Secure campus operations profile'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-3 text-sm text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.9)]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10 lg:p-12 bg-slate-950/70">
          <div className="mb-6 text-center lg:text-left">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Create account</p>
            <h2 className="mt-2 text-3xl font-black text-white">Register student profile</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">First Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Last Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">University Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
                placeholder="john.doe@university.edu"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">University ID</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.universityId}
                  onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  placeholder="STD-2026-101"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  placeholder="+19876543210"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Department</label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
              >
                <option value={1}>Computer Science</option>
                <option value={2}>MCA</option>
                <option value={3}>MBA</option>
                <option value={4}>Electronics</option>
                <option value={5}>Mechanical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl glass-input text-xs"
                placeholder="Create a secure password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-[10px] text-slate-300">
            Account type: Student (self-registration is restricted to student access only).
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl gradient-btn text-xs font-bold text-white shadow-[0_18px_30px_-18px_rgba(14,165,233,0.8)] flex items-center justify-center gap-2 mt-6 transition-transform hover:scale-[1.01]"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-300 hover:text-sky-200 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
