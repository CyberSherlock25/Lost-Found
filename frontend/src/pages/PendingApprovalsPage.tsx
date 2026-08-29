import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Item } from '../types';
import { CheckCircle2, Clock3, MapPin, PackageCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';

export const PendingApprovalsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const loadItems = () => {
    setLoading(true);
    api.get('/items/pending-approvals')
      .then((res) => setItems(res.data.data))
      .catch(() => toast.error('Unable to load pending approvals'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadItems(); }, []);

  const approve = async (itemId: number) => {
    setApprovingId(itemId);
    try {
      await api.patch(`/items/${itemId}/verify`);
      toast.success('Approved and published for students');
      setItems((current) => current.filter((item) => item.itemId !== itemId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Unable to approve item');
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) return <SkeletonLoader count={3} />;

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400">Review desk</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Pending student approvals</h1>
          <p className="mt-2 text-xs text-slate-400">Approve a submission once. It immediately becomes visible in the public student directory.</p>
        </div>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300">{items.length} waiting</span>
      </div>

      {items.length === 0 ? (
        <div className="glass-card rounded-2xl border border-slate-800 p-14 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
          <h2 className="mt-4 text-base font-bold text-white">All clear</h2>
          <p className="mt-2 text-xs text-slate-400">There are no student submissions waiting for approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.itemId} className="glass-card flex flex-col gap-5 rounded-2xl border border-slate-800 p-5 md:flex-row md:items-center">
              <img src={item.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80'} alt={item.title} className="h-28 w-full rounded-xl object-cover md:w-36" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-black text-white">{item.title}</h2>
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] font-bold text-amber-300">UNDER REVIEW</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-300">{item.description || 'No description provided.'}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-indigo-400" /> {item.uploadedBy?.firstName} {item.uploadedBy?.lastName}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-emerald-400" /> {item.location?.locationName}</span>
                  <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-amber-400" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={() => approve(item.itemId)} disabled={approvingId === item.itemId} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50">
                <PackageCheck className="h-4 w-4" /> {approvingId === item.itemId ? 'Approving...' : 'Approve & publish'}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
