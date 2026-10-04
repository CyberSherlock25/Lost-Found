import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  MapPin,
  Send,
  ShieldCheck,
  Tag,
  Upload,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { api } from '../services/api';
import { Item } from '../types';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80';

const MAX_PROOF_FILE_SIZE = 10 * 1024 * 1024;
const MAX_PROOF_DESCRIPTION_LENGTH = 1000;

const formatStatus = (
  status?: string
): string => {
  if (!status) {
    return 'Unknown';
  }

  const statusMap: Record<string, string> = {
    OPEN: 'Available',
    UNDER_REVIEW: 'Under Review',
    CLAIM_REQUESTED: 'Claim Requested',
    CLAIM_APPROVED: 'Claim Approved',
    CLAIM_REJECTED: 'Claim Rejected',
    COLLECTED: 'Collected',
    CLOSED: 'Resolved',
  };

  return (
    statusMap[status] ||
    status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )
  );
};

const formatDate = (
  value?: string
): string => {
  if (!value) {
    return 'Not specified';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusClasses = (
  status?: string
): string => {
  switch (status) {
    case 'OPEN':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';

    case 'UNDER_REVIEW':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-400';

    case 'CLAIM_REQUESTED':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-400';

    case 'CLAIM_APPROVED':
      return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400';

    case 'CLAIM_REJECTED':
      return 'border-rose-500/30 bg-rose-500/10 text-rose-400';

    case 'COLLECTED':
    case 'CLOSED':
      return 'border-slate-600/40 bg-slate-800/70 text-slate-400';

    default:
      return 'border-slate-700 bg-slate-800 text-slate-300';
  }
};

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] =
    useState<Item | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState(false);

  const [selectedImage, setSelectedImage] =
    useState<string>('');

  const [selectedImageIndex, setSelectedImageIndex] =
    useState(0);

  const [failedImages, setFailedImages] =
    useState<Record<string, boolean>>({});

  const [isClaimModalOpen, setIsClaimModalOpen] =
    useState(false);

  const [proofDescription, setProofDescription] =
    useState('');

  const [proofFile, setProofFile] =
    useState<File | null>(null);

  const [proofFileError, setProofFileError] =
    useState('');

  const [submittingClaim, setSubmittingClaim] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  /*
   * --------------------------------------------------
   * Load item
   * --------------------------------------------------
   */

  const loadItem = async () => {
    if (!id) {
      setLoading(false);
      setLoadError(true);
      return;
    }

    setLoading(true);
    setLoadError(false);

    try {
      const response = await api.get(
        `/items/${id}`
      );

      const data = response.data?.data as
        | Item
        | undefined;

      if (!data) {
        throw new Error(
          'Item data was not returned.'
        );
      }

      setItem(data);

      const images = data.images || [];

      const primaryIndex = Math.max(
        images.findIndex(
          (image) => image.isPrimary
        ),
        0
      );

      const primaryImage =
        images[primaryIndex]?.imageUrl ||
        FALLBACK_IMAGE;

      setSelectedImage(primaryImage);
      setSelectedImageIndex(primaryIndex);
      setFailedImages({});
    } catch {
      setItem(null);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, [id]);

  /*
   * --------------------------------------------------
   * Image handling
   * --------------------------------------------------
   */

  const images = useMemo(() => {
    if (!item?.images?.length) {
      return [
        {
          imageId: 0,
          imageUrl: FALLBACK_IMAGE,
          imageName: 'Default item image',
          isPrimary: true,
        },
      ];
    }

    return item.images;
  }, [item]);

  const selectImage = (
    imageUrl: string,
    index: number
  ) => {
    setSelectedImage(imageUrl);
    setSelectedImageIndex(index);
  };

  const showPreviousImage = () => {
    if (images.length <= 1) {
      return;
    }

    const nextIndex =
      selectedImageIndex === 0
        ? images.length - 1
        : selectedImageIndex - 1;

    setSelectedImageIndex(nextIndex);
    setSelectedImage(
      images[nextIndex].imageUrl
    );
  };

  const showNextImage = () => {
    if (images.length <= 1) {
      return;
    }

    const nextIndex =
      selectedImageIndex ===
      images.length - 1
        ? 0
        : selectedImageIndex + 1;

    setSelectedImageIndex(nextIndex);
    setSelectedImage(
      images[nextIndex].imageUrl
    );
  };

  const handleImageError = (
    imageUrl: string
  ) => {
    setFailedImages((previous) => ({
      ...previous,
      [imageUrl]: true,
    }));
  };

  /*
   * --------------------------------------------------
   * Claim modal
   * --------------------------------------------------
   */

  const openClaimModal = () => {
    if (!item) {
      return;
    }

    if (!item.isClaimable) {
      toast.error(
        'This item is currently unavailable for new claims.'
      );
      return;
    }

    if (item.status?.statusName !== 'OPEN') {
      toast.error(
        'This item is no longer available for a new claim.'
      );
      return;
    }

    setProofDescription('');
    setProofFile(null);
    setProofFileError('');
    setIsClaimModalOpen(true);
  };

  const closeClaimModal = () => {
    if (submittingClaim) {
      return;
    }

    setIsClaimModalOpen(false);
    setProofDescription('');
    setProofFile(null);
    setProofFileError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /*
   * --------------------------------------------------
   * Proof file validation
   * --------------------------------------------------
   */

  const handleProofFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] || null;

    setProofFileError('');

    if (!file) {
      setProofFile(null);
      return;
    }

    const isAllowedType =
      file.type === 'application/pdf' ||
      file.type.startsWith('image/');

    if (!isAllowedType) {
      setProofFile(null);
      setProofFileError(
        'Only PDF and image files are allowed.'
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }

    if (file.size > MAX_PROOF_FILE_SIZE) {
      setProofFile(null);
      setProofFileError(
        'Proof file must be 10 MB or smaller.'
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }

    setProofFile(file);
  };

  const removeProofFile = () => {
    setProofFile(null);
    setProofFileError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /*
   * --------------------------------------------------
   * Claim submission
   * --------------------------------------------------
   */

  const handleSubmitClaim = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!item || submittingClaim) {
      return;
    }

    const trimmedProof =
      proofDescription.trim();

    if (!trimmedProof) {
      toast.error(
        'Please describe details that prove ownership.'
      );
      return;
    }

    if (trimmedProof.length < 10) {
      toast.error(
        'Please provide more detailed ownership proof.'
      );
      return;
    }

    if (
      trimmedProof.length >
      MAX_PROOF_DESCRIPTION_LENGTH
    ) {
      toast.error(
        `Proof details cannot exceed ${MAX_PROOF_DESCRIPTION_LENGTH} characters.`
      );
      return;
    }

    if (proofFileError) {
      toast.error(proofFileError);
      return;
    }

    if (!item.isClaimable) {
      toast.error(
        'This item is currently unavailable for new claims.'
      );
      closeClaimModal();
      return;
    }

    if (item.status?.statusName !== 'OPEN') {
      toast.error(
        'This item is no longer available for a new claim.'
      );
      closeClaimModal();
      return;
    }

    setSubmittingClaim(true);

    try {
      /*
       * Step 1:
       * Create the claim.
       */
      const claimResponse = await api.post(
        '/claims',
        {
          itemId: item.itemId,
          proofDescription: trimmedProof,
        }
      );

      const createdClaim =
        claimResponse.data?.data;

      if (!createdClaim?.claimId) {
        throw new Error(
          'Claim was created without a claim ID.'
        );
      }

      /*
       * Step 2:
       * Upload optional proof document.
       */
      if (proofFile) {
        const formData = new FormData();

        formData.append(
          'file',
          proofFile
        );

        await api.post(
          `/claims/${createdClaim.claimId}/proof-document`,
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );
      }

      toast.success(
        'Ownership claim submitted successfully. It will be reviewed by the administrator.'
      );

      closeClaimModal();

      /*
       * Refresh item state so the UI reflects
       * any backend status change.
       */
      await loadItem();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Failed to submit the ownership claim. Please try again.';

      toast.error(message);
    } finally {
      setSubmittingClaim(false);
    }
  };

  /*
   * --------------------------------------------------
   * Loading
   * --------------------------------------------------
   */

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-800" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SkeletonLoader
            count={1}
            variant="card"
          />

          <div className="space-y-4">
            <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-800" />
            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-slate-800" />
            <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-800" />
            <div className="h-56 w-full animate-pulse rounded-2xl bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------
   * Error / not found
   * --------------------------------------------------
   */

  if (loadError || !item) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-lg items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="text-lg font-bold text-slate-100">
            Item not found
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            We couldn't load this item. It may
            have been removed or is temporarily
            unavailable.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={loadItem}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/70 px-4 text-xs font-semibold text-slate-300 transition hover:border-sky-500/40 hover:text-sky-300"
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() => navigate('/browse')}
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-sky-500 px-4 text-xs font-semibold text-white transition hover:bg-sky-400"
            >
              Browse Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status =
    item.status?.statusName;

  const isLost =
    item.type?.typeName === 'LOST';

  const canClaim =
    item.isClaimable &&
    status === 'OPEN';

  /*
   * --------------------------------------------------
   * Render
   * --------------------------------------------------
   */

  return (
    <>
      <div className="mx-auto w-full max-w-6xl space-y-5 sm:space-y-6">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="
            inline-flex
            min-h-10
            items-center
            gap-2
            rounded-xl
            border
            border-transparent
            px-2
            text-xs
            font-semibold
            text-slate-400
            transition
            hover:border-slate-800
            hover:bg-slate-900/50
            hover:text-slate-100
            focus:outline-none
            focus:ring-2
            focus:ring-sky-400/40
          "
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </button>

        {/* Main content */}
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
          {/* ======================================== */}
          {/* Gallery                                 */}
          {/* ======================================== */}

          <section className="min-w-0">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-xl">
              <div className="relative aspect-[4/3] min-h-[280px] overflow-hidden bg-slate-950 sm:min-h-[380px]">
                {failedImages[
                  selectedImage
                ] ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-slate-500">
                    <ImageIcon className="h-10 w-10" />

                    <p className="text-xs">
                      Image unavailable
                    </p>
                  </div>
                ) : (
                  <img
                    src={selectedImage}
                    alt={`${item.title} image ${
                      selectedImageIndex + 1
                    }`}
                    className="h-full w-full object-contain"
                    onError={() =>
                      handleImageError(
                        selectedImage
                      )
                    }
                  />
                )}

                {/* Gradient */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/70 to-transparent" />

                {/* Type */}
                <div className="absolute left-4 top-4">
                  <span
                    className={`
                      inline-flex
                      rounded-xl
                      border
                      px-3
                      py-1.5
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-white
                      shadow-lg
                      backdrop-blur-md
                      ${
                        isLost
                          ? 'border-rose-400/40 bg-rose-500/80'
                          : 'border-emerald-400/40 bg-emerald-500/80'
                      }
                    `}
                  >
                    {item.type?.typeName ||
                      'ITEM'}
                  </span>
                </div>

                {/* Verification */}
                {item.isVerified && (
                  <div className="absolute right-4 top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/80 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-md">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  </div>
                )}

                {/* Image arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={
                        showPreviousImage
                      }
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-slate-900"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={
                        showNextImage
                      }
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-slate-900"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image count */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 rounded-lg border border-white/10 bg-slate-950/70 px-2.5 py-1 text-[10px] font-semibold text-slate-300 backdrop-blur-md">
                    {selectedImageIndex +
                      1}{' '}
                    / {images.length}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map(
                  (image, index) => {
                    const isSelected =
                      index ===
                      selectedImageIndex;

                    return (
                      <button
                        key={
                          image.imageId
                        }
                        type="button"
                        onClick={() =>
                          selectImage(
                            image.imageUrl,
                            index
                          )
                        }
                        aria-label={`View image ${
                          index + 1
                        }`}
                        aria-pressed={
                          isSelected
                        }
                        className={`
                          relative
                          h-16
                          w-16
                          shrink-0
                          overflow-hidden
                          rounded-xl
                          border-2
                          bg-slate-900
                          transition
                          focus:outline-none
                          focus:ring-2
                          focus:ring-sky-400/40
                          sm:h-20
                          sm:w-20
                          ${
                            isSelected
                              ? 'border-sky-400 opacity-100'
                              : 'border-slate-800 opacity-60 hover:border-slate-600 hover:opacity-100'
                          }
                        `}
                      >
                        {failedImages[
                          image.imageUrl
                        ] ? (
                          <div className="flex h-full w-full items-center justify-center text-slate-600">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        ) : (
                          <img
                            src={
                              image.imageUrl
                            }
                            alt=""
                            className="h-full w-full object-cover"
                            onError={() =>
                              handleImageError(
                                image.imageUrl
                              )
                            }
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* ======================================== */}
          {/* Details                                  */}
          {/* ======================================== */}

          <section className="min-w-0 space-y-5">
            {/* Header */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
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
                    ${
                      isLost
                        ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    }
                  `}
                >
                  {item.type?.typeName ||
                    'ITEM'}
                </span>

                <span
                  className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
                    status
                  )}`}
                >
                  {formatStatus(status)}
                </span>

                {item.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[10px] font-bold text-sky-300">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <h1 className="break-words text-2xl font-black tracking-tight text-slate-100 sm:text-3xl">
                {item.title}
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.description ||
                  'No additional description was provided for this item.'}
              </p>
            </div>

            {/* Item information */}
            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50">
              <div className="border-b border-slate-800/70 px-4 py-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Item Information
                </h2>
              </div>

              <div className="divide-y divide-slate-800/70">
                {/* Category */}
                <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                    <Tag className="h-3.5 w-3.5 text-sky-400" />
                    Category
                  </span>

                  <span className="text-xs font-semibold text-slate-200 sm:text-right">
                    {item.category
                      ?.categoryName ||
                      'General'}
                  </span>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-sky-400" />
                    Location
                  </span>

                  <span className="text-xs font-semibold text-slate-200 sm:text-right">
                    {item.location
                      ?.locationName ||
                      'Campus'}
                    {item.location
                      ?.building
                      ? ` · ${item.location.building}`
                      : ''}
                  </span>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-sky-400" />
                    {isLost
                      ? 'Date Lost'
                      : 'Date Found'}
                  </span>

                  <span className="text-xs font-semibold text-slate-200 sm:text-right">
                    {formatDate(
                      isLost
                        ? item.dateLost
                        : item.dateFound
                    )}
                  </span>
                </div>

                {/* Brand */}
                {item.brand && (
                  <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-xs text-slate-500">
                      Brand / Make
                    </span>

                    <span className="text-xs font-semibold text-slate-200 sm:text-right">
                      {item.brand}
                    </span>
                  </div>
                )}

                {/* Color */}
                {item.color && (
                  <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-xs text-slate-500">
                      Color
                    </span>

                    <span className="text-xs font-semibold text-slate-200 sm:text-right">
                      {item.color}
                    </span>
                  </div>
                )}

                {/* Condition */}
                {item.itemCondition && (
                  <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-xs text-slate-500">
                      Condition
                    </span>

                    <span className="text-xs font-semibold text-slate-200 sm:text-right">
                      {item.itemCondition}
                    </span>
                  </div>
                )}

                {/* Serial number */}
                {item.serialNumber && (
                  <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-xs text-slate-500">
                      Serial Number
                    </span>

                    <span className="break-all text-xs font-semibold text-slate-200 sm:text-right">
                      {item.serialNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Verification notice */}
            {item.isVerified && (
              <div className="flex gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />

                <div>
                  <h3 className="text-xs font-bold text-sky-300">
                    Item verified
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    This item has been verified by
                    the platform. Verification does
                    not by itself confirm ownership
                    of the item.
                  </p>
                </div>
              </div>
            )}

            {/* Claim action */}
            {canClaim ? (
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-100">
                      Is this your item?
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Submit ownership details so an
                      administrator can review your claim.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      openClaimModal
                    }
                    className="
                      inline-flex
                      min-h-11
                      shrink-0
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-indigo-500
                      px-5
                      text-xs
                      font-bold
                      text-white
                      shadow-lg
                      shadow-indigo-500/20
                      transition
                      hover:bg-indigo-400
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-400/50
                    "
                  >
                    <Send className="h-4 w-4" />
                    Submit Ownership Claim
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

                <div>
                  <h2 className="text-xs font-bold text-slate-300">
                    New claims are unavailable
                  </h2>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    {status === 'OPEN'
                      ? 'This item is not currently accepting new claims.'
                      : `This item is currently ${formatStatus(
                          status
                        ).toLowerCase()} and cannot receive a new claim.`}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ========================================== */}
      {/* Claim Modal                               */}
      {/* ========================================== */}

      {isClaimModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="claim-modal-title"
        >
          <div className="flex min-h-full items-center justify-center">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
              {/* Header */}
              <div className="border-b border-slate-800/80 px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={
                    closeClaimModal
                  }
                  disabled={
                    submittingClaim
                  }
                  aria-label="Close claim form"
                  className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="pr-8">
                  <h2
                    id="claim-modal-title"
                    className="text-lg font-bold text-slate-100"
                  >
                    Submit Ownership Claim
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Provide information that helps
                    the administrator verify that
                    this item belongs to you.
                  </p>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={
                  handleSubmitClaim
                }
                className="max-h-[calc(100vh-150px)] overflow-y-auto p-5 sm:p-6"
              >
                <div className="space-y-5">
                  {/* Item preview */}
                  <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-900">
                      {failedImages[
                        selectedImage
                      ] ? (
                        <div className="flex h-full items-center justify-center text-slate-600">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      ) : (
                        <img
                          src={
                            selectedImage
                          }
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-200">
                        {item.title}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {item.category
                          ?.categoryName ||
                          'General'}
                      </p>
                    </div>
                  </div>

                  {/* Proof description */}
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="proof-description"
                        className="text-xs font-bold text-slate-300"
                      >
                        Ownership Proof *
                      </label>

                      <span
                        className={`
                          text-[10px]
                          ${
                            proofDescription
                              .length >
                            MAX_PROOF_DESCRIPTION_LENGTH
                              ? 'text-rose-400'
                              : 'text-slate-600'
                          }
                        `}
                      >
                        {
                          proofDescription.length
                        }{' '}
                        /{' '}
                        {
                          MAX_PROOF_DESCRIPTION_LENGTH
                        }
                      </span>
                    </div>

                    <textarea
                      id="proof-description"
                      required
                      rows={5}
                      maxLength={
                        MAX_PROOF_DESCRIPTION_LENGTH
                      }
                      value={
                        proofDescription
                      }
                      onChange={(event) =>
                        setProofDescription(
                          event.target
                            .value
                        )
                      }
                      disabled={
                        submittingClaim
                      }
                      placeholder="Describe unique marks, scratches, accessories, contents, serial details, purchase information, or other details only the owner would know."
                      className="
                        glass-input
                        min-h-32
                        w-full
                        resize-y
                        rounded-xl
                        px-3
                        py-3
                        text-xs
                        leading-5
                        placeholder:text-slate-600
                        focus:ring-2
                        focus:ring-indigo-400/30
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    />

                    <p className="mt-1.5 text-[10px] leading-4 text-slate-600">
                      Avoid sharing unnecessary
                      passwords or highly sensitive
                      personal information.
                    </p>
                  </div>

                  {/* File */}
                  <div>
                    <label
                      htmlFor="proof-file"
                      className="mb-2 block text-xs font-bold text-slate-300"
                    >
                      Supporting Document
                      <span className="ml-1 font-normal text-slate-600">
                        (Optional)
                      </span>
                    </label>

                    <input
                      ref={fileInputRef}
                      id="proof-file"
                      type="file"
                      accept=".pdf,image/*"
                      onChange={
                        handleProofFileChange
                      }
                      disabled={
                        submittingClaim
                      }
                      className="
                        sr-only
                      "
                    />

                    {!proofFile ? (
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        disabled={
                          submittingClaim
                        }
                        className="
                          flex
                          min-h-24
                          w-full
                          flex-col
                          items-center
                          justify-center
                          gap-2
                          rounded-2xl
                          border
                          border-dashed
                          border-slate-700
                          bg-slate-950/30
                          px-4
                          text-center
                          transition
                          hover:border-indigo-500/40
                          hover:bg-indigo-500/5
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-400/40
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        <Upload className="h-5 w-5 text-slate-500" />

                        <span className="text-xs font-semibold text-slate-400">
                          Choose a PDF or image
                        </span>

                        <span className="text-[10px] text-slate-600">
                          Maximum size: 10 MB
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                          {proofFile.type ===
                          'application/pdf' ? (
                            <FileText className="h-5 w-5" />
                          ) : (
                            <ImageIcon className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-slate-300">
                            {
                              proofFile.name
                            }
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-600">
                            {(
                              proofFile.size /
                              1024 /
                              1024
                            ).toFixed(2)}{' '}
                            MB
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={
                            removeProofFile
                          }
                          disabled={
                            submittingClaim
                          }
                          aria-label="Remove proof file"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-rose-400 disabled:opacity-40"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {proofFileError && (
                      <p className="mt-2 text-[10px] font-medium text-rose-400">
                        {proofFileError}
                      </p>
                    )}
                  </div>

                  {/* Notice */}
                  <div className="flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

                    <p className="text-[10px] leading-5 text-slate-500">
                      Submitting a claim does not
                      automatically transfer ownership.
                      Your claim will be reviewed before
                      any final decision is made.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={
                        closeClaimModal
                      }
                      disabled={
                        submittingClaim
                      }
                      className="
                        min-h-11
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-800/60
                        px-5
                        text-xs
                        font-semibold
                        text-slate-400
                        transition
                        hover:border-slate-600
                        hover:text-slate-200
                        focus:outline-none
                        focus:ring-2
                        focus:ring-slate-500/40
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        submittingClaim ||
                        !proofDescription.trim() ||
                        Boolean(
                          proofFileError
                        )
                      }
                      className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-indigo-500
                        px-5
                        text-xs
                        font-bold
                        text-white
                        shadow-lg
                        shadow-indigo-500/20
                        transition
                        hover:bg-indigo-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-400/50
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      {submittingClaim ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Claim
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};