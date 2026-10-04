import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  MapPin,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Item } from '../../types';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
}) => {
  const primaryImage =
    item.images?.find((image) => image.isPrimary)
      ?.imageUrl ||
    item.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';

  const isLost = item.type?.typeName === 'LOST';

  const statusName =
    item.status?.statusName || 'OPEN';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
            Available
          </span>
        );

      case 'CLAIM_REQUESTED':
        return (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-400">
            Claim Requested
          </span>
        );

      case 'CLAIM_APPROVED':
        return (
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2.5 py-1 text-[10px] font-bold text-indigo-400">
            Claim Approved
          </span>
        );

      case 'COLLECTED':
      case 'CLOSED':
        return (
          <span className="rounded-full border border-slate-600/30 bg-slate-700/50 px-2.5 py-1 text-[10px] font-bold text-slate-400">
            Resolved
          </span>
        );

      default:
        return (
          <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-300">
            {status}
          </span>
        );
    }
  };

  const itemType = item.type?.typeName || 'FOUND';

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
        group
        flex
        min-w-0
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-slate-800/80
        bg-slate-900/50
        shadow-xl
        transition
        duration-300
        hover:-translate-y-1
        hover:border-sky-500/25
        hover:shadow-sky-950/20
      "
    >
      {/* Image */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-slate-900 sm:h-48">
        <img
          src={primaryImage}
          alt={item.title}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* Image overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Type badge */}
        <div className="absolute left-3 top-3 flex max-w-[70%] gap-2">
          <span
            className={`
              rounded-lg
              border
              px-2.5
              py-1
              text-[10px]
              font-extrabold
              uppercase
              tracking-wider
              text-white
              shadow-md
              backdrop-blur-md
              sm:px-3
              ${
                isLost
                  ? 'border-rose-400/40 bg-rose-500/80'
                  : 'border-emerald-400/40 bg-emerald-500/80'
              }
            `}
          >
            {itemType}
          </span>

          {item.isVerified && (
            <span
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-sky-400/40
                bg-sky-500/80
                text-white
                backdrop-blur-md
              "
              title="Security Verified"
              aria-label="Security verified"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          )}
        </div>

        {/* Status */}
        <div className="absolute right-3 top-3 max-w-[55%]">
          {getStatusBadge(statusName)}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="min-w-0">
          {/* Category */}
          <div className="mb-1 flex min-w-0 items-center gap-2 text-xs font-semibold text-sky-400">
            <Tag className="h-3.5 w-3.5 shrink-0" />

            <span className="truncate">
              {item.category?.categoryName ||
                'General'}
            </span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-1 text-base font-bold text-slate-100 transition-colors group-hover:text-sky-400">
            {item.title}
          </h3>

          {/* Description */}
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {item.description ||
              'No description provided.'}
          </p>
        </div>

        {/* Metadata */}
        <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-400">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />

              <span className="truncate">
                {item.location?.locationName ||
                  'Campus'}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />

              <span className="whitespace-nowrap">
                {item.dateFound ||
                  item.dateLost ||
                  new Date(
                    item.createdAt
                  ).toLocaleDateString()}
              </span>
            </div>
          </div>

          {(item.brand || item.color) && (
            <div className="flex flex-wrap gap-2">
              {item.brand && (
                <span className="max-w-full truncate rounded-md border border-slate-700/50 bg-slate-800/80 px-2 py-1 text-[10px] text-slate-400">
                  Brand: {item.brand}
                </span>
              )}

              {item.color && (
                <span className="max-w-full truncate rounded-md border border-slate-700/50 bg-slate-800/80 px-2 py-1 text-[10px] text-slate-400">
                  Color: {item.color}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action */}
        <Link
          to={`/items/${item.itemId}`}
          className="
            mt-4
            inline-flex
            min-h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-700
            bg-slate-800/50
            px-4
            py-2.5
            text-xs
            font-semibold
            text-sky-300
            transition
            hover:border-sky-500/40
            hover:bg-sky-600/20
            hover:text-white
            focus:outline-none
            focus:ring-2
            focus:ring-sky-400/50
          "
        >
          <span>View Details & Claim</span>

          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
};