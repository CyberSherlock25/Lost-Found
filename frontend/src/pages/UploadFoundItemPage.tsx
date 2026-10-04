import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Category, Location } from '../types';
import toast from 'react-hot-toast';
import {
  PackageCheck,
  ShieldCheck,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import {
  validateDate,
  validateImageFiles,
  validateRequired,
  ValidationErrors,
} from '../utils/validation';

export const UploadFoundItemPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedImages, setSelectedImages] =
    useState<File[]>([]);

  const [errors, setErrors] =
    useState<ValidationErrors>({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    locationId: '',
    typeId: 2,
    brand: '',
    color: '',
    serialNumber: '',
    itemCondition: 'Good',
    dateFound: new Date()
      .toISOString()
      .split('T')[0],
    remarks: 'Handed over to security desk',
  });

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch(() => {});

    api
      .get('/locations')
      .then((res) => setLocations(res.data.data))
      .catch(() => {});
  }, []);

  const updateField = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const imageError = validateImageFiles(files);

    if (imageError) {
      setErrors((prev) => ({
        ...prev,
        images: imageError,
      }));

      setSelectedImages([]);
      e.target.value = '';
      toast.error(imageError);
      return;
    }

    setErrors((prev) => ({
      ...prev,
      images: undefined,
    }));

    setSelectedImages(files);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const titleError = validateRequired(
      formData.title,
      'Item title'
    );

    if (titleError) {
      newErrors.title = titleError;
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required.';
    }

    if (!formData.locationId) {
      newErrors.locationId =
        'Found location is required.';
    }

    const dateError = validateDate(
      formData.dateFound,
      'Date found'
    );

    if (dateError) {
      newErrors.dateFound = dateError;
    }

    const imageError =
      validateImageFiles(selectedImages);

    if (imageError) {
      newErrors.images = imageError;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please correct the highlighted fields.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        brand: formData.brand.trim(),
        color: formData.color.trim(),
        serialNumber: formData.serialNumber.trim(),
        remarks: formData.remarks.trim(),
        categoryId: Number(formData.categoryId),
        locationId: Number(formData.locationId),
      };

      const itemResponse = await api.post(
        '/items',
        payload
      );

      const createdItem = itemResponse.data.data;

      for (const image of selectedImages) {
        const formDataUpload = new FormData();

        formDataUpload.append('file', image);

        await api.post(
          `/items/${createdItem.itemId}/images`,
          formDataUpload,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );
      }

      toast.success(
        'Found item uploaded successfully!'
      );

      navigate('/items');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Failed to upload found item'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100">
            Upload Found Item
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Staff / Security portal for registering items
            recovered on campus
          </p>
        </div>

        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold w-fit">
          <ShieldCheck className="w-4 h-4" />
          Auto-Verified Entry
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4"
        noValidate
      >
        <div>
          <label
            htmlFor="found-title"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
          >
            Item Title *
          </label>

          <input
            id="found-title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              updateField('title', e.target.value)
            }
            placeholder="e.g. Black Leather Bi-Fold Wallet"
            className={`w-full px-4 py-2.5 rounded-xl glass-input text-xs ${
              errors.title
                ? 'border-rose-500/70'
                : ''
            }`}
          />

          {errors.title && (
            <p className="mt-1 text-[11px] text-rose-400">
              {errors.title}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="found-category"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              Category *
            </label>

            <select
              id="found-category"
              value={formData.categoryId}
              onChange={(e) =>
                updateField(
                  'categoryId',
                  e.target.value
                )
              }
              className={`w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900 ${
                errors.categoryId
                  ? 'border-rose-500/70'
                  : ''
              }`}
            >
              <option value="">
                Select Category
              </option>

              {categories.map((c) => (
                <option
                  key={c.categoryId}
                  value={c.categoryId}
                >
                  {c.categoryName}
                </option>
              ))}
            </select>

            {errors.categoryId && (
              <p className="mt-1 text-[11px] text-rose-400">
                {errors.categoryId}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="found-location"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              Found Location *
            </label>

            <select
              id="found-location"
              value={formData.locationId}
              onChange={(e) =>
                updateField(
                  'locationId',
                  e.target.value
                )
              }
              className={`w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900 ${
                errors.locationId
                  ? 'border-rose-500/70'
                  : ''
              }`}
            >
              <option value="">
                Select Location
              </option>

              {locations.map((l) => (
                <option
                  key={l.locationId}
                  value={l.locationId}
                >
                  {l.locationName}
                </option>
              ))}
            </select>

            {errors.locationId && (
              <p className="mt-1 text-[11px] text-rose-400">
                {errors.locationId}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="found-date"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              Date Found
            </label>

            <input
              id="found-date"
              type="date"
              value={formData.dateFound}
              onChange={(e) =>
                updateField(
                  'dateFound',
                  e.target.value
                )
              }
              className={`w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900 ${
                errors.dateFound
                  ? 'border-rose-500/70'
                  : ''
              }`}
            />

            {errors.dateFound && (
              <p className="mt-1 text-[11px] text-rose-400">
                {errors.dateFound}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="found-brand"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              Brand / Make
            </label>

            <input
              id="found-brand"
              type="text"
              value={formData.brand}
              onChange={(e) =>
                updateField(
                  'brand',
                  e.target.value
                )
              }
              placeholder="e.g. Tommy Hilfiger"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div>
            <label
              htmlFor="found-color"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              Color
            </label>

            <input
              id="found-color"
              type="text"
              value={formData.color}
              onChange={(e) =>
                updateField(
                  'color',
                  e.target.value
                )
              }
              placeholder="e.g. Black"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="found-serial"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
          >
            Serial Number / Unique Identifier
          </label>

          <input
            id="found-serial"
            type="text"
            value={formData.serialNumber}
            onChange={(e) =>
              updateField(
                'serialNumber',
                e.target.value
              )
            }
            placeholder="e.g. SN-8849201"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <div>
          <label
            htmlFor="found-description"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
          >
            Detailed Description
          </label>

          <textarea
            id="found-description"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              updateField(
                'description',
                e.target.value
              )
            }
            placeholder="Provide identifying details, scratches, stickers, markings, etc."
            className="w-full p-3 rounded-xl glass-input text-xs"
          />
        </div>

        <div>
          <label
            htmlFor="found-images"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
          >
            Upload Item Image(s)
          </label>

          <div className="relative">
            <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

            <input
              id="found-images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-xs"
            />
          </div>

          <p className="mt-1 text-[10px] text-slate-500">
            Image files only. Maximum 10 MB per image.
          </p>

          {errors.images && (
            <p className="mt-1 text-[11px] text-rose-400">
              {errors.images}
            </p>
          )}

          {selectedImages.length > 0 && (
            <div className="mt-3 space-y-2">
              {selectedImages.map((image, index) => (
                <div
                  key={`${image.name}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2"
                >
                  <span className="text-[11px] text-slate-300 truncate">
                    {image.name}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                    aria-label={`Remove ${image.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="found-remarks"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
          >
            Storage / Custody Location Remarks
          </label>

          <input
            id="found-remarks"
            type="text"
            value={formData.remarks}
            onChange={(e) =>
              updateField(
                'remarks',
                e.target.value
              )
            }
            placeholder="e.g. Main Gate Security Locker #4"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl gradient-btn text-xs font-bold text-white shadow-xl shadow-indigo-500/25 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Uploading...'
            : 'Publish Found Item Listing'}
        </button>
      </form>
    </div>
  );
};