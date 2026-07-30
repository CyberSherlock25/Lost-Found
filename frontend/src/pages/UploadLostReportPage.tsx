import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Category, Location } from '../types';
import toast from 'react-hot-toast';
import { PlusCircle, Image as ImageIcon, MapPin, Tag, Calendar, ShieldAlert } from 'lucide-react';

export const UploadLostReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    locationId: '',
    typeId: 1, // LOST
    brand: '',
    color: '',
    serialNumber: '',
    itemCondition: 'Good',
    dateLost: new Date().toISOString().split('T')[0],
    remarks: '',
    imageUrls: [''],
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
        imageUrls: formData.imageUrls.filter((url) => url.trim() !== ''),
      };

      await api.post('/items', payload);
      toast.success('Lost item report filed successfully!');
      navigate('/items');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to file lost report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Report Lost Item</h1>
        <p className="text-xs text-slate-400 mt-1">Submit details of an item you lost on campus so security and students can assist in recovery.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Item Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Sony WH-1000XM5 Headphones"
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Lost Location *</label>
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Date Lost</label>
            <input
              type="date"
              value={formData.dateLost}
              onChange={(e) => setFormData({ ...formData, dateLost: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Brand / Make</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g. Apple"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Color</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="e.g. Space Gray"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Serial Number / Unique Identifier</label>
          <input
            type="text"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            placeholder="e.g. SN-8849201"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Detailed Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide details such as sticker placement, scratches, wallpaper description..."
            className="w-full p-3 rounded-xl glass-input text-xs"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Photo Image URL</label>
          <input
            type="url"
            value={formData.imageUrls[0]}
            onChange={(e) => setFormData({ ...formData, imageUrls: [e.target.value] })}
            placeholder="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl gradient-btn text-xs font-bold text-white shadow-xl shadow-indigo-500/25 mt-4"
        >
          {loading ? 'Filing Report...' : 'Publish Lost Item Report'}
        </button>
      </form>
    </div>
  );
};
