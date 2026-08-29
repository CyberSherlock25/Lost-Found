import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.data);
      toast.success('Logged in successfully');

      const role = res.data.data.role;
      const returnPath = (location.state as { from?: string } | null)?.from;
      if (returnPath) {
        navigate(returnPath, { replace: true });
      } else if (role === 'ADMIN' || role === 'STAFF') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/student');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_35%),#020b14]">
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute -left-20 top-20 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] rounded-[32px] border border-slate-700/80 bg-slate-950/70 shadow-[0_40px_100px_-35px_rgba(14,165,233,0.4)] overflow-hidden relative z-10 backdrop-blur-xl">
        <div className="relative hidden lg:flex flex-col justify-between p-10 bg-[linear-gradient(160deg,rgba(15,23,42,0.96),rgba(12,18,30,0.84),rgba(6,78,59,0.18))] border-r border-slate-800">
          <div>
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-teal-500 flex items-center justify-center text-white font-black shadow-xl shadow-sky-500/25">LF</div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-sky-300 font-bold">University ERP</p>
                <h1 className="text-lg font-black text-slate-100 tracking-[0.18em]">LOST & FOUND</h1>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Secure access</p>
                <h2 className="mt-2 text-4xl font-black leading-tight text-white">Campus recovery operations, made precise.</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-slate-300">
                Manage item recovery, ownership claims, verification workflows, and reporting in one professional operations portal.
              </p>
            </div>
          </div>

          <div className="grid gap-4 mt-10">
            {[
              'Verified claim processing',
              'Secure proof verification',
              'Operational campus visibility',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-3 text-sm text-slate-200 animate-[fadeUp_0.5s_ease-out]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10 lg:p-12 bg-slate-950/70">
          <div className="text-center mb-8 lg:hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-teal-500 flex items-center justify-center shadow-xl shadow-sky-500/20 text-white font-black text-2xl mx-auto mb-3">LF</div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Campus Operations Login</h2>
            <p className="text-xs text-slate-400 mt-1">Secure access to the management portal</p>
          </div>

          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Sign in</p>
            <h3 className="mt-2 text-3xl font-black text-white">Welcome back</h3>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              University Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-sky-300 hover:text-sky-200 font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl glass-input text-xs"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl gradient-btn text-xs font-bold text-white shadow-[0_18px_30px_-18px_rgba(14,165,233,0.8)] flex items-center justify-center gap-2 mt-6 transition-transform hover:scale-[1.01]"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Need access?{' '}
            <Link to="/register" className="text-sky-300 hover:text-sky-200 font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
