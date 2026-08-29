import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Lock, Mail, Shield, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glowing Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/25 text-white font-black text-2xl mx-auto mb-3">
            LF
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Enterprise Lost & Found</h2>
          <p className="text-xs text-slate-400 mt-1">Smart University Centralized Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-btn text-xs font-bold text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-400" /> Demo Quick Logins
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoLogin('admin@university.edu')}
              className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-indigo-500/40 text-left"
            >
              <span className="font-bold text-indigo-400 block">Admin</span>
              <span className="text-[10px] text-slate-500 truncate block">admin@university.edu</span>
            </button>
            <button
              onClick={() => handleDemoLogin('alex.morgan@university.edu')}
              className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-indigo-500/40 text-left"
            >
              <span className="font-bold text-emerald-400 block">Student</span>
              <span className="text-[10px] text-slate-500 truncate block">alex.morgan@university.edu</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
