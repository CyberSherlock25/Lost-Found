import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Claim } from '../types';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';
import { FileCheck, CheckCircle2, XCircle, Clock, ShieldCheck, User, Package, MessageSquare } from 'lucide-react';

export const ClaimsManagementPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // Review Modal State
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [reviewerRemarks, setReviewerRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchClaims = () => {
    setLoading(true);
    api.get('/claims')
      .then((res) => setClaims(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleReview = async (claimStatus: 'APPROVED' | 'REJECTED') => {
    if (!selectedClaim) return;
    setSubmitting(true);
    try {
      await api.post(`/claims/${selectedClaim.claimId}/review`, {
        claimStatus,
        reviewerRemarks,
      });
      toast.success(`Claim successfully ${claimStatus.toLowerCase()}`);
      setSelectedClaim(null);
      fetchClaims();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to review claim');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkCollected = async (claimId: number) => {
    try {
      await api.post(`/claims/${claimId}/collect`);
      toast.success('Item marked as collected!');
      fetchClaims();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const filteredClaims = claims.filter((c) => {
    if (activeTab === 'ALL') return true;
    return c.claimStatus === activeTab;
  });

  if (loading) return <SkeletonLoader count={3} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Claims Verification Queue</h1>
        <p className="text-xs text-slate-400 mt-1">Review student ownership proof and approve item collection</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-950/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Claims Grid / Table */}
      {filteredClaims.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center text-slate-400 text-xs">
          No claims found under current filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <div key={claim.claimId} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Item Info */}
              <div className="flex items-start gap-4">
                <img
                  src={claim.item?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'}
                  alt="Item"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-100">{claim.item?.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-indigo-400" /> Claimant: {claim.claimant?.firstName} {claim.claimant?.lastName} ({claim.claimant?.universityId})</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {new Date(claim.claimedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="font-semibold text-indigo-400">Proof Submitted: </span>
                    {claim.proofDescription}
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  claim.claimStatus === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : claim.claimStatus === 'PENDING'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {claim.claimStatus}
                </span>

                {claim.claimStatus === 'PENDING' && (
                  <button
                    onClick={() => {
                      setSelectedClaim(claim);
                      setReviewerRemarks('');
                    }}
                    className="px-4 py-2 rounded-xl gradient-btn text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
                  >
                    Review Proof
                  </button>
                )}

                {claim.claimStatus === 'APPROVED' && (
                  <button
                    onClick={() => handleMarkCollected(claim.claimId)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20"
                  >
                    Mark Collected
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-1">Review Claim Request</h3>
            <p className="text-xs text-slate-400 mb-4">Item: <span className="text-indigo-400 font-semibold">{selectedClaim.item?.title}</span></p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Reviewer Feedback Remarks</label>
                <textarea
                  rows={3}
                  value={reviewerRemarks}
                  onChange={(e) => setReviewerRemarks(e.target.value)}
                  placeholder="Provide approval instructions or rejection reason..."
                  className="w-full p-3 rounded-xl glass-input text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedClaim(null)}
                  className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleReview('REJECTED')}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-xs font-bold text-white"
                >
                  Reject Claim
                </button>
                <button
                  type="button"
                  onClick={() => handleReview('APPROVED')}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20"
                >
                  Approve Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
