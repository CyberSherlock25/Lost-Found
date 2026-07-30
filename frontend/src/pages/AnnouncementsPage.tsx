import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Announcement } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';
import { Megaphone, Pin, PlusCircle, Trash2, Calendar, User } from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { role } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Post Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPinned, setIsPinned] = useState(false);

  const fetchAnnouncements = () => {
    setLoading(true);
    api.get('/announcements')
      .then((res) => setAnnouncements(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/announcements', {
        title,
        message,
        startDate,
        isPinned,
      });
      toast.success('Announcement published!');
      setIsModalOpen(false);
      setTitle('');
      setMessage('');
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post announcement');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await api.delete(`/announcements/${id}`);
        toast.success('Announcement deleted');
        fetchAnnouncements();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <SkeletonLoader count={2} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Campus Notice Board</h1>
          <p className="text-xs text-slate-400 mt-1">Official announcements regarding lost & found policies, drop boxes, and semester audits</p>
        </div>

        {(role === 'ADMIN' || role === 'STAFF') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl gradient-btn text-xs font-bold text-white shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Post Notice
          </button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.announcementId}
            className={`glass-card p-6 rounded-2xl border transition ${
              a.isPinned ? 'border-indigo-500/40 bg-indigo-950/20 shadow-lg shadow-indigo-950/30' : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {a.isPinned && <Pin className="w-4 h-4 text-indigo-400 fill-indigo-400" />}
                <h3 className="text-base font-bold text-slate-100">{a.title}</h3>
              </div>

              {(role === 'ADMIN' || role === 'STAFF') && (
                <button
                  onClick={() => handleDelete(a.announcementId)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">{a.message}</p>

            <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-800/60">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-indigo-400" /> Posted by: {a.postedBy?.firstName} {a.postedBy?.lastName}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {new Date(a.startDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Post Campus Announcement</h3>
            <form onSubmit={handlePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  placeholder="e.g. End of Semester Return Drive"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Notice Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-xs"
                  placeholder="Announcement details..."
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="pinned" className="text-xs text-slate-300 font-medium">Pin this notice to top</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-400">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl gradient-btn text-xs font-bold text-white shadow-lg shadow-indigo-500/20">Publish Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
