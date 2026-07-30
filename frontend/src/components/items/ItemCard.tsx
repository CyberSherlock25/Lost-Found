import React from 'react';
import { Item } from '../../types';
import { MapPin, Calendar, Tag, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const primaryImage = item.images?.find(i => i.isPrimary)?.imageUrl ||
    item.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';

  const isLost = item.type?.typeName === 'LOST';

  const getStatusBadge = (statusName: string) => {
    switch (statusName) {
      case 'OPEN':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Available</span>;
      case 'CLAIM_REQUESTED':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Claim Requested</span>;
      case 'CLAIM_APPROVED':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Claim Approved</span>;
      case 'COLLECTED':
      case 'CLOSED':
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/30">Resolved</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300">{statusName}</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col group"
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={primaryImage}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Type Badge (LOST / FOUND) */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md shadow-md ${
            isLost
              ? 'bg-rose-500/80 text-white border border-rose-400/40'
              : 'bg-emerald-500/80 text-white border border-emerald-400/40'
          }`}>
            {item.type?.typeName || 'FOUND'}
          </span>
          {item.isVerified && (
            <span className="p-1 rounded-lg bg-indigo-500/80 text-white border border-indigo-400/40 backdrop-blur-md" title="Security Verified">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {getStatusBadge(item.status?.statusName || 'OPEN')}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{item.category?.categoryName || 'General'}</span>
          </div>

          <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {item.description || 'No description provided.'}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate">{item.location?.locationName || 'Campus'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{item.dateFound || item.dateLost || new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {(item.brand || item.color) && (
            <div className="flex gap-2 text-[11px] text-slate-400">
              {item.brand && <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">Brand: {item.brand}</span>}
              {item.color && <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">Color: {item.color}</span>}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          to={`/items/${item.itemId}`}
          className="w-full mt-2 py-2.5 px-4 rounded-xl glass-panel text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-500/50 flex items-center justify-center gap-2 transition"
        >
          <span>View Details & Claim</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};
