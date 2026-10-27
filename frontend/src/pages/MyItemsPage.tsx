import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock, ExternalLink, Package, Plus, RefreshCw, Search, ShieldCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Item } from '../types';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';

export const MyItemsPage: React.FC = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await api.get(isAdmin ? '/items/manage' : '/items/my');
      setItems(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error: any) {
      setLoadError(true);
      toast.error(error.response?.data?.message || 'Could not load reported items.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { void fetchItems(); }, [fetchItems]);

  const visibleItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      [item.title, item.description, item.type?.typeName, item.status?.statusName,
       item.location?.locationName, item.uploadedBy?.firstName, item.uploadedBy?.lastName]
        .some((value) => value?.toLowerCase().includes(term))
    );
  }, [items, search]);

  const handleDelete = async (item: Item) => {
    const prompt = isAdmin
      ? `Remove "${item.title}" from active listings? This hides it from users while preserving claim history.`
      : `Delete your report "${item.title}"? It will be removed from active listings. This cannot be undone from this screen.`;
    if (!window.confirm(prompt)) return;

    setDeletingId(item.itemId);
    try {
      await api.delete(`/items/${item.itemId}`);
      setItems((current) => current.filter((entry) => entry.itemId !== item.itemId));
      toast.success('Item removed from active listings.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not remove this item.');
    } finally {
      setDeletingId(null);
    }
  };

  const statusStyle = (item: Item) => {
    if (!item.isActive) return 'border-slate-700 bg-slate-800 text-slate-400';
    if (!item.isVerified) return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
    if (item.status?.statusName === 'CLAIM_APPROVED' || item.status?.statusName === 'COLLECTED') {
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    }
    return 'border-sky-500/30 bg-sky-500/10 text-sky-300';
  };

  if (loading) return <SkeletonLoader count={4} />;

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-200">
              {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
              {isAdmin ? 'Administrator controls' : 'Your reports'}
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              {isAdmin ? 'Item Management' : 'My Reported Items'}
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
              {isAdmin
                ? 'Review active lost-and-found reports across the platform. Remove any report when necessary; claim history is retained.'
                : 'Manage only the lost-and-found reports you submitted. Removing a report hides it from active listings without erasing its history.'}
            </p>
          </div>
          {!isAdmin && (
            <div className="flex flex-wrap gap-2">
              <Link to="/items/report-lost" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-sky-400">
                <Plus className="h-4 w-4" /> Report Lost
              </Link>
              <Link to="/items/report-found" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-xs font-bold text-slate-200 transition hover:border-sky-500/40">
                <Package className="h-4 w-4" /> Report Found
              </Link>
            </div>
          )}
        </div>
        <div className="relative mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active reports</p>
            <p className="mt-1 text-2xl font-black text-white">{items.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Needs verification</p>
            <p className="mt-1 text-2xl font-black text-amber-300">{items.filter((item) => !item.isVerified).length}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100">Reports</h2>
            <p className="mt-1 text-xs text-slate-500">Search by title, type, status, location, or reporter.</p>
          </div>
          <div className="flex gap-2">
            <label className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 sm:w-72 sm:flex-none">
              <Search className="h-4 w-4 shrink-0 text-slate-500" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reports..." className="w-full min-w-0 bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-600" />
            </label>
            <button type="button" onClick={() => void fetchItems()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs font-semibold text-slate-300 transition hover:border-sky-500/40 hover:text-white">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
        </div>

        {loadError ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
            <AlertTriangle className="mx-auto h-7 w-7 text-rose-300" />
            <p className="mt-3 text-sm font-bold text-slate-100">Couldn't load reports</p>
            <button onClick={() => void fetchItems()} className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-white">Try again</button>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center">
            <Package className="mx-auto h-8 w-8 text-slate-600" />
            <h3 className="mt-3 text-sm font-bold text-slate-200">{search ? 'No matching reports' : 'No active reports yet'}</h3>
            <p className="mt-1 text-xs text-slate-500">{search ? 'Try a different search term.' : isAdmin ? 'There are no active reports to manage.' : 'Reports you submit will appear here.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {visibleItems.map((item) => (
              <article key={item.itemId} className="group min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition duration-200 hover:-translate-y-0.5 hover:border-sky-500/30 hover:bg-slate-900/80">
                <div className="flex gap-4 p-4 sm:p-5">
                  <img src={item.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=240&q=80'} alt={item.title} className="h-20 w-20 shrink-0 rounded-xl border border-slate-800 object-cover sm:h-24 sm:w-24" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">#{item.itemId} · {item.type?.typeName || 'ITEM'}</p>
                        <h3 className="mt-1 break-words text-sm font-bold text-slate-100 sm:text-base">{item.title}</h3>
                      </div>
                      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold ${statusStyle(item)}`}>
                        {item.isVerified ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {item.isVerified ? (item.status?.statusName || 'VERIFIED').replaceAll('_', ' ') : 'PENDING VERIFICATION'}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">{item.description || 'No description provided.'}</p>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
                      {item.location?.locationName && <span>{item.location.locationName}</span>}
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : 'Date unavailable'}</span>
                      {isAdmin && item.uploadedBy && <span>By {item.uploadedBy.firstName} {item.uploadedBy.lastName}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 bg-slate-950/30 px-4 py-3 sm:px-5">
                  <Link to={`/items/${item.itemId}`} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/10 hover:text-sky-200">
                    <ExternalLink className="h-3.5 w-3.5" /> View details
                  </Link>
                  <button type="button" onClick={() => void handleDelete(item)} disabled={deletingId === item.itemId} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs font-bold text-rose-300 transition hover:border-rose-500/40 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50">
                    <Trash2 className="h-3.5 w-3.5" /> {deletingId === item.itemId ? 'Removing…' : 'Delete report'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyItemsPage;
