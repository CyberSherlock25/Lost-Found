import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Category, Location } from '../types';
import toast from 'react-hot-toast';
import { PackageCheck, ShieldCheck } from 'lucide-react';

export const UploadFoundItemPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    locationId: '',
    typeId: 2, // FOUND
    brand: '',
    color: '',
    serialNumber: '',
    itemCondition: 'Good',
    dateFound: new Date().toISOString().split('T')[0],
    remarks: 'Handed over to security desk',
  });

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data)).catch(() => {});
    api.get('/locations').then((res) => setLocations(res.data.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        categoryId: Number(formData.categoryId),
        locationId: Number(formData.locationId),
      };

      const itemResponse = await api.post('/items', payload);
      const createdItem = itemResponse.data.data;

      for (const image of selectedImages) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', image);
        await api.post(`/items/${createdItem.itemId}/images`, formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('Found item uploaded & verified successfully!');
      navigate('/items');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload found item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Upload Found Item</h1>
          <p className="text-xs text-slate-400 mt-1">Staff / Security portal for registering items recovered on campus</p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" /> Auto-Verified Entry
        </span>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Item Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Black Leather Bi-Fold Wallet"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Category *</label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Found Location *</label>
            <select
              required
              value={formData.locationId}
              onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
            >
              <option value="">Select Location</option>
              {locations.map((l) => (
                <option key={l.locationId} value={l.locationId}>{l.locationName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Date Found</label>
            <input
              type="date"
              value={formData.dateFound}
              onChange={(e) => setFormData({ ...formData, dateFound: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Brand / Make</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g. Tommy Hilfiger"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Color</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="e.g. Black"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Upload Item Image(s)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setSelectedImages(Array.from(e.target.files || []))}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-xs"
          />
          {selectedImages.length > 0 && (
            <p className="mt-2 text-[10px] text-emerald-400">Selected {selectedImages.length} image(s)</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Storage / Custody Location Remarks</label>
          <input
            type="text"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="e.g. Main Gate Security Locker #4"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl gradient-btn text-xs font-bold text-white shadow-xl shadow-indigo-500/25 mt-4"
        >
          {loading ? 'Uploading...' : 'Publish Found Item Listing'}
        </button>
      </form>
    </div>
  );
};
