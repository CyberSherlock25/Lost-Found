import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Claim } from '../types';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { Clock, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export const MyClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/claims/my')
      .then((res) => setClaims(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonLoader count={2} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-100">My Ownership Claims</h1>
        <p className="text-xs text-slate-400 mt-1">Track verification progress and pickup status for items you claimed</p>
      </div>

      {claims.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center text-slate-400 text-xs">
          You have not submitted any ownership claims yet.
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.claimId} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">{claim.item?.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Submitted on: {new Date(claim.claimedAt).toLocaleDateString()}</p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  claim.claimStatus === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : claim.claimStatus === 'PENDING'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {claim.claimStatus}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <span className="font-semibold text-indigo-400">Proof Submitted: </span>
                <span className="text-slate-300">{claim.proofDescription}</span>
              </div>

              {claim.reviewerRemarks && (
                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs">
                  <span className="font-semibold text-indigo-300">Admin Remarks: </span>
                  <span className="text-slate-300">{claim.reviewerRemarks}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
