import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Item } from '../types';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Tag, ShieldCheck, User, FileText, ArrowLeft, Send, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Claim Modal
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [proofDescription, setProofDescription] = useState('');
  const [proofDocumentUrl, setProofDocumentUrl] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/items/${id}`)
        .then((res) => {
          setItem(res.data.data);
          const primary = res.data.data.images?.find((i: any) => i.isPrimary)?.imageUrl ||
            res.data.data.images?.[0]?.imageUrl ||
            'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';
          setSelectedImage(primary);
        })
        .catch(() => toast.error('Item not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setSubmittingClaim(true);
    try {
      await api.post('/claims', {
        itemId: item.itemId,
        proofDescription,
        proofDocumentUrl,
      });
      toast.success('Ownership claim submitted successfully! Admin will review your claim.');
      setIsClaimModalOpen(false);
      // Refresh item details
      api.get(`/items/${id}`).then((res) => setItem(res.data.data));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setSubmittingClaim(false);
    }
  };

  if (loading) return <SkeletonLoader count={1} />;
  if (!item) return <div className="text-center py-12 text-slate-400">Item not found.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs text-slate-400 hover:text-white font-semibold transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Browse
      </button>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="glass-card rounded-3xl overflow-hidden h-80 bg-slate-900 border border-slate-800 flex items-center justify-center">
            <img src={selectedImage} alt={item.title} className="w-full h-full object-cover" />
          </div>

          {/* Thumbnails */}
          {item.images && item.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {item.images.map((img) => (
                <button
                  key={img.imageId}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img.imageUrl ? 'border-indigo-500 shadow-lg shadow-indigo-500/25 scale-105' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <img src={img.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Specs */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                item.type?.typeName === 'LOST' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {item.type?.typeName}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {item.status?.statusName}
              </span>
              {item.isVerified && (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" /> Verified
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black text-slate-100">{item.title}</h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.description || 'No additional description.'}</p>
          </div>

          {/* Metadata Table */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-indigo-400" /> Category:</span>
              <span className="font-bold text-slate-200">{item.category?.categoryName}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Found / Lost Location:</span>
              <span className="font-bold text-slate-200">{item.location?.locationName} ({item.location?.building || 'Main Campus'})</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date Logged:</span>
              <span className="font-bold text-slate-200">{item.dateFound || item.dateLost || new Date(item.createdAt).toLocaleDateString()}</span>
            </div>

            {item.brand && (
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Brand / Make:</span>
                <span className="font-bold text-slate-200">{item.brand}</span>
              </div>
            )}

            {item.color && (
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Color:</span>
                <span className="font-bold text-slate-200">{item.color}</span>
              </div>
            )}

            {item.uploadedBy && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-indigo-400" /> Logged By:</span>
                <span className="font-bold text-slate-200">{item.uploadedBy.firstName} {item.uploadedBy.lastName} ({item.uploadedBy.roleName})</span>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          {item.isClaimable && item.status?.statusName === 'OPEN' && (
            <button
              onClick={() => setIsClaimModalOpen(true)}
              className="w-full py-3.5 rounded-2xl gradient-btn text-xs font-bold text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Ownership Claim
            </button>
          )}
        </div>
      </div>

      {/* Claim Submission Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-1">Submit Ownership Proof</h3>
            <p className="text-xs text-slate-400 mb-4">
              Provide unique identifying details (e.g. wallpaper description, scratches, serial numbers, receipt, engraved initials).
            </p>

            <form onSubmit={handleSubmitClaim} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Proof Details & Secret Identifiers *
                </label>
                <textarea
                  required
                  rows={4}
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  placeholder="Describe unique marks, password hints, contents inside..."
                  className="w-full p-3 rounded-xl glass-input text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Proof Image / Document URL (Optional)
                </label>
                <input
                  type="url"
                  value={proofDocumentUrl}
                  onChange={(e) => setProofDocumentUrl(e.target.value)}
                  placeholder="https://example.com/receipt-proof.jpg"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingClaim}
                  className="px-5 py-2 rounded-xl gradient-btn text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
                >
                  {submittingClaim ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
