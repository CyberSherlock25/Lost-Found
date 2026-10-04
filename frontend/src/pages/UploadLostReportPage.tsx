import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Category, Location } from '../types';
import toast from 'react-hot-toast';
import {
  PlusCircle,
  Image as ImageIcon,
  MapPin,
  Tag,
  Calendar,
  ShieldAlert,
  X,
} from 'lucide-react';
import {
  validateDate,
  validateImageFiles,
  validateRequired,
  ValidationErrors,
} from '../utils/validation';

export const UploadLostReportPage: React.FC = () => {
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
    typeId: 1,
    brand: '',
    color: '',
    serialNumber: '',
    itemCondition: 'Good',
    dateLost: new Date()
      .toISOString()
      .split('T')[0],
    remarks: '',
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
      newErrors.locationId = 'Lost location is required.';
    }

    const dateError = validateDate(
      formData.dateLost,
      'Date lost'
    );

    if (dateError) {
      newErrors.dateLost = dateError;
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
        'Lost item report filed successfully!'
      );

      navigate('/items');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Failed to file lost report'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100">
          Report Lost Item
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          Submit details of an item you lost on campus so
          security and students can assist in recovery.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4"
        noValidate
      >
        <div>
          <label
            htmlFor="lost-title"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
          >
            Item Title *
          </label>

          <input
            id="lost-title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              updateField('title', e.target.value)
            }
            placeholder="e.g. Sony WH-1000XM5 Headphones"
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
              htmlFor="lost-category"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              Category *
            </label>

            <select
              id="lost-category"
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
              htmlFor="lost-location"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              Lost Location *
            </label>

            <select
              id="lost-location"
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
              htmlFor="lost-date"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              Date Lost
            </label>

            <input
              id="lost-date"
              type="date"
              value={formData.dateLost}
              onChange={(e) =>
                updateField(
                  'dateLost',
                  e.target.value
                )
              }
              className={`w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900 ${
                errors.dateLost
                  ? 'border-rose-500/70'
                  : ''
              }`}
            />

            {errors.dateLost && (
              <p className="mt-1 text-[11px] text-rose-400">
                {errors.dateLost}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lost-brand"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              Brand / Make
            </label>

            <input
              id="lost-brand"
              type="text"
              value={formData.brand}
              onChange={(e) =>
                updateField(
                  'brand',
                  e.target.value
                )
              }
              placeholder="e.g. Apple"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div>
            <label
              htmlFor="lost-color"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              Color
            </label>

            <input
              id="lost-color"
              type="text"
              value={formData.color}
              onChange={(e) =>
                updateField(
                  'color',
                  e.target.value
                )
              }
              placeholder="e.g. Space Gray"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="lost-serial"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
          >
            Serial Number / Unique Identifier
          </label>

          <input
            id="lost-serial"
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
            htmlFor="lost-description"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
          >
            Detailed Description
          </label>

          <textarea
            id="lost-description"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              updateField(
                'description',
                e.target.value
              )
            }
            placeholder="Provide details such as sticker placement, scratches, wallpaper description..."
            className="w-full p-3 rounded-xl glass-input text-xs"
          />
        </div>

        <div>
          <label
            htmlFor="lost-images"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
          >
            Upload Item Image(s)
          </label>

          <div className="relative">
            <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

            <input
              id="lost-images"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl gradient-btn text-xs font-bold text-white shadow-xl shadow-indigo-500/25 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Filing Report...'
            : 'Publish Lost Item Report'}
        </button>
      </form>
    </div>
  );
};