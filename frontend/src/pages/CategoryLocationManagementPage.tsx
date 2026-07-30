import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Category, Location } from '../types';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';
import { Layers, MapPin, Plus } from 'lucide-react';

export const CategoryLocationManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // New Category
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // New Location
  const [locName, setLocName] = useState('');
  const [building, setBuilding] = useState('');
  const [floorNo, setFloorNo] = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get('/categories'), api.get('/locations')])
      .then(([catRes, locRes]) => {
        setCategories(catRes.data.data);
        setLocations(locRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/categories', { categoryName: catName, description: catDesc });
      toast.success('Category added');
      setCatName('');
      setCatDesc('');
      fetchData();
    } catch (err) {
      toast.error('Failed to add category');
    }
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/locations', { locationName: locName, building, floorNo });
      toast.success('Location added');
      setLocName('');
      setBuilding('');
      setFloorNo('');
      fetchData();
    } catch (err) {
      toast.error('Failed to add location');
    }
  };

  if (loading) return <SkeletonLoader count={2} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Categories & Campus Locations</h1>
        <p className="text-xs text-slate-400 mt-1">Manage master data categories and campus physical drop-off zones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Item Categories ({categories.length})</span>
          </div>

          <form onSubmit={handleAddCategory} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
            <input
              type="text"
              required
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="Category Name (e.g. Smartwatches)"
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
            <input
              type="text"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
            <button type="submit" className="w-full py-2 rounded-xl gradient-btn text-xs font-bold text-white flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </form>

          <div className="glass-card rounded-2xl border border-slate-800 divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
            {categories.map((c) => (
              <div key={c.categoryId} className="p-3 text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-200">{c.categoryName}</p>
                  <p className="text-[10px] text-slate-400">{c.description || 'No description'}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Locations Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <span>Campus Locations ({locations.length})</span>
          </div>

          <form onSubmit={handleAddLocation} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
            <input
              type="text"
              required
              value={locName}
              onChange={(e) => setLocName(e.target.value)}
              placeholder="Location Name (e.g. Science Block Lab 2)"
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="Building Name"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
              <input
                type="text"
                value={floorNo}
                onChange={(e) => setFloorNo(e.target.value)}
                placeholder="Floor (e.g. 2nd Floor)"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
            <button type="submit" className="w-full py-2 rounded-xl gradient-btn text-xs font-bold text-white flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" /> Add Campus Location
            </button>
          </form>

          <div className="glass-card rounded-2xl border border-slate-800 divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
            {locations.map((l) => (
              <div key={l.locationId} className="p-3 text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-200">{l.locationName}</p>
                  <p className="text-[10px] text-slate-400">{l.building} • {l.floorNo}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
