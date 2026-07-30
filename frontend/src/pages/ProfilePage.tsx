import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, CreditCard, Lock, Camera, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/profile', { firstName, lastName, phone });
      updateUser(res.data.data);
      toast.success('Profile details updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.post('/profile/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(res.data.data);
      toast.success('Profile avatar updated');
    } catch (err) {
      toast.error('Failed to upload image');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Account Profile & Security</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your personal information, profile photo, and password credentials</p>
      </div>

      {/* Profile Header Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-6">
        <div className="relative group">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt="Profile Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/50 shadow-xl"
          />
          <label className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
            <Camera className="w-6 h-6 text-white" />
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-100">{user?.firstName} {user?.lastName}</h2>
          <p className="text-xs text-slate-400">{user?.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Role: {user?.roleName}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
              ID: {user?.universityId}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Personal Details */}
      <form onSubmit={handleUpdateProfile} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Personal Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="px-5 py-2.5 rounded-xl gradient-btn text-xs font-bold text-white shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Profile Details
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Security & Password</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={savingPassword}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-100 flex items-center gap-2 border border-slate-700"
        >
          <Lock className="w-4 h-4 text-indigo-400" /> Update Password
        </button>
      </form>
    </div>
  );
};
