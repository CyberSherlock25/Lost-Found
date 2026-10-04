import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import {
  Mail,
  Phone,
  CreditCard,
  Lock,
  Camera,
  Save,
} from 'lucide-react';
import {
  validateName,
  validatePassword,
  validatePhone,
  ValidationErrors,
  hasValidationErrors,
} from '../utils/validation';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [firstName, setFirstName] =
    useState(user?.firstName || '');

  const [lastName, setLastName] =
    useState(user?.lastName || '');

  const [phone, setPhone] =
    useState(user?.phone || '');

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [savingPassword, setSavingPassword] =
    useState(false);

  const [uploadingAvatar, setUploadingAvatar] =
    useState(false);

  const [profileErrors, setProfileErrors] =
    useState<ValidationErrors>({});

  const [passwordErrors, setPasswordErrors] =
    useState<ValidationErrors>({});

  const handleUpdateProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const errors: ValidationErrors = {};

    const firstNameError = validateName(
      firstName,
      'First name'
    );

    const lastNameError = validateName(
      lastName,
      'Last name'
    );

    const phoneError = validatePhone(phone);

    if (firstNameError) {
      errors.firstName = firstNameError;
    }

    if (lastNameError) {
      errors.lastName = lastNameError;
    }

    if (phoneError) {
      errors.phone = phoneError;
    }

    setProfileErrors(errors);

    if (hasValidationErrors(errors)) {
      toast.error('Please correct the highlighted fields.');
      return;
    }

    setSavingProfile(true);

    try {
      const res = await api.put('/profile', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      });

      updateUser(res.data.data);

      toast.success(
        'Profile details updated successfully'
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Failed to update profile'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const errors: ValidationErrors = {};

    if (!currentPassword) {
      errors.currentPassword =
        'Current password is required.';
    }

    const newPasswordError = validatePassword(
      newPassword,
      'New password'
    );

    if (newPasswordError) {
      errors.newPassword = newPasswordError;
    }

    if (
      currentPassword &&
      newPassword &&
      currentPassword === newPassword
    ) {
      errors.newPassword =
        'New password must be different from your current password.';
    }

    setPasswordErrors(errors);

    if (hasValidationErrors(errors)) {
      toast.error('Please correct the highlighted fields.');
      return;
    }

    setSavingPassword(true);

    try {
      await api.post(
        '/profile/change-password',
        {
          currentPassword,
          newPassword,
        }
      );

      toast.success(
        'Password changed successfully'
      );

      setCurrentPassword('');
      setNewPassword('');
      setPasswordErrors({});
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Failed to change password'
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      e.target.value = '';
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        'Profile image must be 10 MB or smaller.'
      );
      e.target.value = '';
      return;
    }

    const formData = new FormData();

    formData.append('file', file);

    setUploadingAvatar(true);

    try {
      const res = await api.post(
        '/profile/avatar',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

      updateUser(res.data.data);

      toast.success(
        'Profile avatar updated'
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Failed to upload image'
      );
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-100">
          Account Profile & Security
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          Manage your personal information, profile photo,
          and password credentials
        </p>
      </div>

      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative group flex-shrink-0">
          <img
            src={
              user?.profileImage ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            }
            alt="Profile Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/50 shadow-xl"
          />

          <label
            className={`absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center transition cursor-pointer ${
              uploadingAvatar
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            {uploadingAvatar ? (
              <span className="text-[9px] text-white font-semibold">
                Uploading...
              </span>
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
              className="hidden"
            />
          </label>
        </div>

        <div className="min-w-0 text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-100 truncate">
            {user?.firstName} {user?.lastName}
          </h2>

          <p className="text-xs text-slate-400 truncate">
            {user?.email}
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Role: {user?.roleName}
            </span>

            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
              ID: {user?.universityId}
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleUpdateProfile}
        className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4"
        noValidate
      >
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="profile-first-name"
              className="block text-xs font-semibold text-slate-300 mb-1"
            >
              First Name
            </label>

            <input
              id="profile-first-name"
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);

                if (profileErrors.firstName) {
                  setProfileErrors((prev) => ({
                    ...prev,
                    firstName: undefined,
                  }));
                }
              }}
              className={`w-full px-3 py-2 rounded-xl glass-input text-xs ${
                profileErrors.firstName
                  ? 'border-rose-500/70'
                  : ''
              }`}
              autoComplete="given-name"
            />

            {profileErrors.firstName && (
              <p className="mt-1 text-[11px] text-rose-400">
                {profileErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="profile-last-name"
              className="block text-xs font-semibold text-slate-300 mb-1"
            >
              Last Name
            </label>

            <input
              id="profile-last-name"
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);

                if (profileErrors.lastName) {
                  setProfileErrors((prev) => ({
                    ...prev,
                    lastName: undefined,
                  }));
                }
              }}
              className={`w-full px-3 py-2 rounded-xl glass-input text-xs ${
                profileErrors.lastName
                  ? 'border-rose-500/70'
                  : ''
              }`}
              autoComplete="family-name"
            />

            {profileErrors.lastName && (
              <p className="mt-1 text-[11px] text-rose-400">
                {profileErrors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="profile-phone"
            className="block text-xs font-semibold text-slate-300 mb-1"
          >
            Phone Number
          </label>

          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);

                if (profileErrors.phone) {
                  setProfileErrors((prev) => ({
                    ...prev,
                    phone: undefined,
                  }));
                }
              }}
              className={`w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs ${
                profileErrors.phone
                  ? 'border-rose-500/70'
                  : ''
              }`}
              autoComplete="tel"
            />
          </div>

          {profileErrors.phone && (
            <p className="mt-1 text-[11px] text-rose-400">
              {profileErrors.phone}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl gradient-btn text-xs font-bold text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />

          {savingProfile
            ? 'Saving...'
            : 'Save Profile Details'}
        </button>
      </form>

      <form
        onSubmit={handleChangePassword}
        className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4"
        noValidate
      >
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
          Security & Password
        </h3>

        <div>
          <label
            htmlFor="current-password"
            className="block text-xs font-semibold text-slate-300 mb-1"
          >
            Current Password
          </label>

          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);

              if (passwordErrors.currentPassword) {
                setPasswordErrors((prev) => ({
                  ...prev,
                  currentPassword: undefined,
                }));
              }
            }}
            className={`w-full px-3 py-2 rounded-xl glass-input text-xs ${
              passwordErrors.currentPassword
                ? 'border-rose-500/70'
                : ''
            }`}
            autoComplete="current-password"
          />

          {passwordErrors.currentPassword && (
            <p className="mt-1 text-[11px] text-rose-400">
              {passwordErrors.currentPassword}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="profile-new-password"
            className="block text-xs font-semibold text-slate-300 mb-1"
          >
            New Password
          </label>

          <input
            id="profile-new-password"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);

              if (passwordErrors.newPassword) {
                setPasswordErrors((prev) => ({
                  ...prev,
                  newPassword: undefined,
                }));
              }
            }}
            className={`w-full px-3 py-2 rounded-xl glass-input text-xs ${
              passwordErrors.newPassword
                ? 'border-rose-500/70'
                : ''
            }`}
            autoComplete="new-password"
          />

          {passwordErrors.newPassword && (
            <p className="mt-1 text-[11px] text-rose-400">
              {passwordErrors.newPassword}
            </p>
          )}

          <p className="mt-1 text-[10px] text-slate-500">
            Minimum 8 characters with uppercase, lowercase,
            and a number.
          </p>
        </div>

        <button
          type="submit"
          disabled={savingPassword}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-100 flex items-center justify-center gap-2 border border-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Lock className="w-4 h-4 text-indigo-400" />

          {savingPassword
            ? 'Updating...'
            : 'Update Password'}
        </button>
      </form>
    </div>
  );
};