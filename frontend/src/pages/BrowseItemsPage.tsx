import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Item, Category, Location } from '../types';
import { ItemCard } from '../components/items/ItemCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, Filter, Grid, List, Tag, MapPin, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const BrowseItemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [locationId, setLocationId] = useState(searchParams.get('locationId') || '');
  const [typeId, setTypeId] = useState(searchParams.get('typeId') || '');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Fetch categories and locations master data
    api.get('/categories').then((res) => setCategories(res.data.data)).catch(() => {});
    api.get('/locations').then((res) => setLocations(res.data.data)).catch(() => {});
  }, []);

  const fetchItems = () => {
    setLoading(true);
    const params: any = { page: 0, size: 24, sortBy: 'createdAt', sortDir: 'DESC' };
    if (query) params.query = query;
    if (categoryId) params.categoryId = categoryId;
    if (locationId) params.locationId = locationId;
    if (typeId) params.typeId = typeId;
    if (brand) params.brand = brand;
    if (color) params.color = color;

    api.get('/items', { params })
      .then((res) => setItems(res.data.data.content))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [query, categoryId, locationId, typeId, brand, color]);

  const handleResetFilters = () => {
    setQuery('');
    setCategoryId('');
    setLocationId('');
    setTypeId('');
    setBrand('');
    setColor('');
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Browse & Search Items</h1>
          <p className="text-xs text-slate-400 mt-1">Explore all reported lost and found items across the university campus</p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'grid' ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40' : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'list' ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40' : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      {/* Filter Bar Panel */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Title, brand, serial no..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Category Select */}
          <div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
              ))}
            </select>
          </div>

          {/* Location Select */}
          <div>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900"
            >
              <option value="">All Campus Locations</option>
              {locations.map((l) => (
                <option key={l.locationId} value={l.locationId}>{l.locationName}</option>
              ))}
            </select>
          </div>

          {/* Type Select (LOST / FOUND) */}
          <div>
            <select
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900"
            >
              <option value="">All Types (LOST & FOUND)</option>
              <option value="1">LOST Only</option>
              <option value="2">FOUND Only</option>
            </select>
          </div>
        </div>

        {/* Secondary Filters & Clear Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Brand (e.g. Apple, Sony)"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs w-36"
            />
            <input
              type="text"
              placeholder="Color (e.g. Black, Blue)"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs w-36"
            />
          </div>

          <button
            onClick={handleResetFilters}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-indigo-500/10 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset All Filters
          </button>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : items.length === 0 ? (
        <EmptyState onAction={handleResetFilters} actionLabel="Clear Filters" />
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {items.map((item) => (
            <ItemCard key={item.itemId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
