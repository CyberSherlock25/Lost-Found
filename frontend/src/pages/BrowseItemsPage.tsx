import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import { api } from '../services/api';
import {
  Category,
  Item,
  Location,
  PagedResponse,
} from '../types';

import { ItemCard } from '../components/items/ItemCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';

const PAGE_SIZE = 24;
const SEARCH_DEBOUNCE_MS = 400;

const getSafePage = (value: string | null): number => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}) => {
  const firstItem =
    totalElements === 0
      ? 0
      : currentPage * pageSize + 1;

  const lastItem = Math.min(
    (currentPage + 1) * pageSize,
    totalElements
  );

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) {
      return [];
    }

    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      for (let page = 0; page < totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(0);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(
      totalPages - 2,
      currentPage + 1
    );

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 4) {
      pages.push('ellipsis');
    }

    pages.push(totalPages - 1);

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) {
    return totalElements > 0 ? (
      <div className="flex items-center justify-center border-t border-slate-800/70 pt-5 text-xs text-slate-500">
        Showing{' '}
        <span className="mx-1 font-semibold text-slate-300">
          {firstItem}-{lastItem}
        </span>{' '}
        of{' '}
        <span className="ml-1 font-semibold text-slate-300">
          {totalElements}
        </span>{' '}
        items
      </div>
    ) : null;
  }

  return (
    <div className="border-t border-slate-800/70 pt-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Result count */}
        <p className="text-center text-xs text-slate-500 lg:text-left">
          Showing{' '}
          <span className="font-semibold text-slate-300">
            {firstItem}-{lastItem}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-slate-300">
            {totalElements}
          </span>{' '}
          items
        </p>

        {/* Pagination controls */}
        <div className="flex items-center justify-center gap-1.5">
          {/* Previous */}
          <button
            type="button"
            onClick={() =>
              onPageChange(currentPage - 1)
            }
            disabled={currentPage === 0}
            aria-label="Go to previous page"
            className="
              inline-flex
              h-9
              min-w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-700
              bg-slate-900/70
              px-2
              text-slate-400
              transition
              hover:border-sky-500/40
              hover:bg-sky-500/10
              hover:text-sky-300
              focus:outline-none
              focus:ring-2
              focus:ring-sky-400/40
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          <div className="hidden items-center gap-1.5 sm:flex">
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-9 min-w-7 items-center justify-center text-xs text-slate-600"
                  >
                    ...
                  </span>
                );
              }

              const isActive =
                page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-label={`Go to page ${page + 1}`}
                  aria-current={
                    isActive ? 'page' : undefined
                  }
                  className={`
                    inline-flex
                    h-9
                    min-w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    px-2.5
                    text-xs
                    font-semibold
                    transition
                    focus:outline-none
                    focus:ring-2
                    focus:ring-sky-400/40
                    ${
                      isActive
                        ? 'border-sky-500/40 bg-sky-500/15 text-sky-300'
                        : 'border-slate-700 bg-slate-900/70 text-slate-400 hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-300'
                    }
                  `}
                >
                  {page + 1}
                </button>
              );
            })}
          </div>

          {/* Mobile page indicator */}
          <div className="flex h-9 items-center rounded-lg border border-slate-800 bg-slate-900/70 px-3 text-xs font-semibold text-slate-300 sm:hidden">
            {currentPage + 1} / {totalPages}
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            disabled={currentPage >= totalPages - 1}
            aria-label="Go to next page"
            className="
              inline-flex
              h-9
              min-w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-700
              bg-slate-900/70
              px-2
              text-slate-400
              transition
              hover:border-sky-500/40
              hover:bg-sky-500/10
              hover:text-sky-300
              focus:outline-none
              focus:ring-2
              focus:ring-sky-400/40
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const BrowseItemsPage: React.FC = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  /*
   * --------------------------------------------------
   * State
   * --------------------------------------------------
   */

  const [items, setItems] = useState<Item[]>([]);

  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const [locations, setLocations] = useState<
    Location[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [totalElements, setTotalElements] =
    useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [page, setPage] = useState(
    getSafePage(searchParams.get('page'))
  );

  const [query, setQuery] = useState(
    searchParams.get('query') || ''
  );

  const [categoryId, setCategoryId] = useState(
    searchParams.get('categoryId') || ''
  );

  const [locationId, setLocationId] = useState(
    searchParams.get('locationId') || ''
  );

  const [typeId, setTypeId] = useState(
    searchParams.get('typeId') || ''
  );

  const [brand, setBrand] = useState(
    searchParams.get('brand') || ''
  );

  const [color, setColor] = useState(
    searchParams.get('color') || ''
  );

  const [viewMode, setViewMode] = useState<
    'grid' | 'list'
  >('grid');

  /*
   * Debounced text filters
   */
  const [debouncedQuery, setDebouncedQuery] =
    useState(query);

  const [debouncedBrand, setDebouncedBrand] =
    useState(brand);

  const [debouncedColor, setDebouncedColor] =
    useState(color);

  const requestIdRef = useRef(0);

  /*
   * --------------------------------------------------
   * URL synchronization
   * --------------------------------------------------
   */

  useEffect(() => {
    const nextParams = new URLSearchParams();

    if (query.trim()) {
      nextParams.set('query', query.trim());
    }

    if (categoryId) {
      nextParams.set('categoryId', categoryId);
    }

    if (locationId) {
      nextParams.set('locationId', locationId);
    }

    if (typeId) {
      nextParams.set('typeId', typeId);
    }

    if (brand.trim()) {
      nextParams.set('brand', brand.trim());
    }

    if (color.trim()) {
      nextParams.set('color', color.trim());
    }

    if (page > 0) {
      nextParams.set('page', String(page));
    }

    setSearchParams(nextParams, {
      replace: true,
    });
  }, [
    query,
    categoryId,
    locationId,
    typeId,
    brand,
    color,
    page,
    setSearchParams,
  ]);

  /*
   * --------------------------------------------------
   * Debounce search inputs
   * --------------------------------------------------
   */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedBrand(brand.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [brand]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedColor(color.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [color]);

  /*
   * --------------------------------------------------
   * Load categories and locations
   * --------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    const loadFilterData = async () => {
      try {
        const [categoriesResponse, locationsResponse] =
          await Promise.all([
            api.get('/categories'),
            api.get('/locations'),
          ]);

        if (!mounted) {
          return;
        }

        const categoryData =
          categoriesResponse.data?.data;

        const locationData =
          locationsResponse.data?.data;

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : []
        );

        setLocations(
          Array.isArray(locationData)
            ? locationData
            : []
        );
      } catch {
        if (!mounted) {
          return;
        }

        /*
         * Filter metadata failing should not break
         * the complete browse page.
         */
        setCategories([]);
        setLocations([]);
      }
    };

    loadFilterData();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * --------------------------------------------------
   * Fetch items
   * --------------------------------------------------
   */

  const fetchItems = useCallback(
  async (
    targetPage: number,
    signal?: AbortSignal
  ) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(false);

    const params: Record<string, string | number> = {
      page: targetPage,
      size: PAGE_SIZE,
      sortBy: 'createdAt',
      sortDir: 'DESC',
    };

    if (debouncedQuery) {
      params.query = debouncedQuery;
    }

    if (categoryId) {
      params.categoryId = categoryId;
    }

    if (locationId) {
      params.locationId = locationId;
    }

    if (typeId) {
      params.typeId = typeId;
    }

    if (debouncedBrand) {
      params.brand = debouncedBrand;
    }

    if (debouncedColor) {
      params.color = debouncedColor;
    }

    try {
      const response = await api.get('/items', {
        params,
        signal,
      });

      if (signal?.aborted) {
        return;
      }

      if (requestId !== requestIdRef.current) {
        return;
      }

      const data = response.data?.data as
        | PagedResponse<Item>
        | undefined;

      const content = Array.isArray(data?.content)
        ? data.content
        : [];

      const total =
        Number(data?.totalElements ?? 0);

      const calculatedTotalPages =
        Number(data?.totalPages ?? 0) ||
        (total > 0
          ? Math.ceil(total / PAGE_SIZE)
          : 0);

      setItems(content);
      setTotalElements(total);
      setTotalPages(calculatedTotalPages);

      if (
        calculatedTotalPages > 0 &&
        targetPage >= calculatedTotalPages
      ) {
        setPage(calculatedTotalPages - 1);
      }
    } catch (requestError) {
      if (
        signal?.aborted ||
        requestId !== requestIdRef.current
      ) {
        return;
      }

      setItems([]);
      setTotalElements(0);
      setTotalPages(0);
      setError(true);
    } finally {
      if (
        requestId === requestIdRef.current &&
        !signal?.aborted
      ) {
        setLoading(false);
      }
    }
  },
  [
    debouncedQuery,
    categoryId,
    locationId,
    typeId,
    debouncedBrand,
    debouncedColor,
  ]
);

useEffect(() => {
  const controller = new AbortController();

  fetchItems(page, controller.signal);

  return () => {
    controller.abort();
  };
}, [fetchItems, page]);
  /*
   * --------------------------------------------------
   * Filter helpers
   * --------------------------------------------------
   */

  const resetToFirstPage = () => {
    setPage(0);
  };

  const handleQueryChange = (
    value: string
  ) => {
    setQuery(value);
    resetToFirstPage();
  };

  const handleBrandChange = (
    value: string
  ) => {
    setBrand(value);
    resetToFirstPage();
  };

  const handleColorChange = (
    value: string
  ) => {
    setColor(value);
    resetToFirstPage();
  };

  const handleCategoryChange = (
    value: string
  ) => {
    setCategoryId(value);
    resetToFirstPage();
  };

  const handleLocationChange = (
    value: string
  ) => {
    setLocationId(value);
    resetToFirstPage();
  };

  const handleTypeChange = (
    value: string
  ) => {
    setTypeId(value);
    resetToFirstPage();
  };

  const handleResetFilters = () => {
    setQuery('');
    setCategoryId('');
    setLocationId('');
    setTypeId('');
    setBrand('');
    setColor('');
    setPage(0);
  };

  const handlePageChange = (
    nextPage: number
  ) => {
    if (
      nextPage < 0 ||
      nextPage >= totalPages ||
      nextPage === page
    ) {
      return;
    }

    setPage(nextPage);

    /*
     * Bring the results section into view after
     * pagination on smaller screens.
     */
    window.requestAnimationFrame(() => {
      const resultsElement =
        document.getElementById(
          'browse-results'
        );

      resultsElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  /*
   * --------------------------------------------------
   * Active filters
   * --------------------------------------------------
   */

  const hasActiveFilters =
    Boolean(query.trim()) ||
    Boolean(categoryId) ||
    Boolean(locationId) ||
    Boolean(typeId) ||
    Boolean(brand.trim()) ||
    Boolean(color.trim());

  const activeFilterCount = useMemo(() => {
    return [
      query.trim(),
      categoryId,
      locationId,
      typeId,
      brand.trim(),
      color.trim(),
    ].filter(Boolean).length;
  }, [
    query,
    categoryId,
    locationId,
    typeId,
    brand,
    color,
  ]);

  /*
   * --------------------------------------------------
   * Render
   * --------------------------------------------------
   */

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      {/* -------------------------------------------- */}
      {/* Page Header                                  */}
      {/* -------------------------------------------- */}

      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-300">
            <SlidersHorizontal className="h-3 w-3" />
            Item Registry
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-100 sm:text-3xl">
            Browse & Search Items
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
            Explore reported lost and found items
            across the university campus.
          </p>
        </div>

        {/* View switcher */}
        <div className="flex shrink-0 self-start rounded-xl border border-slate-800 bg-slate-900/60 p-1 lg:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            className={`
              inline-flex
              min-h-9
              items-center
              justify-center
              gap-1.5
              rounded-lg
              px-3
              text-xs
              font-semibold
              transition
              focus:outline-none
              focus:ring-2
              focus:ring-sky-400/40
              ${
                viewMode === 'grid'
                  ? 'bg-sky-500/15 text-sky-300'
                  : 'text-slate-500 hover:text-slate-200'
              }
            `}
          >
            <Grid className="h-4 w-4" />

            <span className="hidden sm:inline">
              Grid
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
            className={`
              inline-flex
              min-h-9
              items-center
              justify-center
              gap-1.5
              rounded-lg
              px-3
              text-xs
              font-semibold
              transition
              focus:outline-none
              focus:ring-2
              focus:ring-sky-400/40
              ${
                viewMode === 'list'
                  ? 'bg-sky-500/15 text-sky-300'
                  : 'text-slate-500 hover:text-slate-200'
              }
            `}
          >
            <List className="h-4 w-4" />

            <span className="hidden sm:inline">
              List
            </span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------- */}
      {/* Filter Panel                                 */}
      {/* -------------------------------------------- */}

      <section
        aria-label="Search and filters"
        className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-xl sm:p-5"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-200">
                Search & Filters
              </h2>

              {activeFilterCount > 0 && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-bold text-sky-300">
                  {activeFilterCount}
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
              Narrow down the item registry.
            </p>
          </div>

          {hasActiveFilters && (
            <span className="hidden rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold text-sky-300 sm:inline-flex">
              Filters active
            </span>
          )}
        </div>

        {/* Primary filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Keyword */}
          <div className="relative min-w-0 sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              type="search"
              placeholder="Title, brand, serial no..."
              value={query}
              onChange={(event) =>
                handleQueryChange(
                  event.target.value
                )
              }
              aria-label="Search items"
              className="
                glass-input
                h-10
                w-full
                min-w-0
                rounded-xl
                pl-9
                pr-9
                text-xs
                placeholder:text-slate-600
                focus:ring-2
                focus:ring-sky-400/20
              "
            />

            {query && (
              <button
                type="button"
                onClick={() =>
                  handleQueryChange('')
                }
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category */}
          <select
            value={categoryId}
            onChange={(event) =>
              handleCategoryChange(
                event.target.value
              )
            }
            aria-label="Filter by category"
            className="
              glass-input
              h-10
              w-full
              min-w-0
              rounded-xl
              bg-slate-900
              px-3
              text-xs
              focus:ring-2
              focus:ring-sky-400/20
            "
          >
            <option value="">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category.categoryId}
                value={category.categoryId}
              >
                {category.categoryName}
              </option>
            ))}
          </select>

          {/* Location */}
          <select
            value={locationId}
            onChange={(event) =>
              handleLocationChange(
                event.target.value
              )
            }
            aria-label="Filter by campus location"
            className="
              glass-input
              h-10
              w-full
              min-w-0
              rounded-xl
              bg-slate-900
              px-3
              text-xs
              focus:ring-2
              focus:ring-sky-400/20
            "
          >
            <option value="">
              All Campus Locations
            </option>

            {locations.map((location) => (
              <option
                key={location.locationId}
                value={location.locationId}
              >
                {location.locationName}
              </option>
            ))}
          </select>

          {/* Type */}
          <select
            value={typeId}
            onChange={(event) =>
              handleTypeChange(
                event.target.value
              )
            }
            aria-label="Filter by item type"
            className="
              glass-input
              h-10
              w-full
              min-w-0
              rounded-xl
              bg-slate-900
              px-3
              text-xs
              focus:ring-2
              focus:ring-sky-400/20
            "
          >
            <option value="">
              All Types (LOST & FOUND)
            </option>

            <option value="1">
              LOST Only
            </option>

            <option value="2">
              FOUND Only
            </option>
          </select>
        </div>

        {/* Secondary filters */}
        <div className="mt-4 flex flex-col gap-3 border-t border-slate-800/70 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Brand (e.g. Apple, Sony)"
              value={brand}
              onChange={(event) =>
                handleBrandChange(
                  event.target.value
                )
              }
              aria-label="Filter by brand"
              className="
                glass-input
                h-10
                w-full
                rounded-xl
                px-3
                text-xs
                placeholder:text-slate-600
                sm:w-52
              "
            />

            <input
              type="text"
              placeholder="Color (e.g. Black, Blue)"
              value={color}
              onChange={(event) =>
                handleColorChange(
                  event.target.value
                )
              }
              aria-label="Filter by color"
              className="
                glass-input
                h-10
                w-full
                rounded-xl
                px-3
                text-xs
                placeholder:text-slate-600
                sm:w-52
              "
            />
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            className="
              inline-flex
              min-h-10
              items-center
              justify-center
              gap-1.5
              rounded-xl
              border
              border-transparent
              px-3
              text-xs
              font-semibold
              text-sky-400
              transition
              hover:border-sky-500/20
              hover:bg-sky-500/10
              hover:text-sky-300
              focus:outline-none
              focus:ring-2
              focus:ring-sky-400/40
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        </div>

        {/* Search debounce hint */}
        {(query ||
          brand ||
          color) && (
          <p className="mt-3 text-[10px] text-slate-600">
            Search updates automatically after you
            stop typing.
          </p>
        )}
      </section>

      {/* -------------------------------------------- */}
      {/* Results                                      */}
      {/* -------------------------------------------- */}

      <section
        id="browse-results"
        aria-label="Browse results"
        className="scroll-mt-24"
      >
        {/* Result header */}
        {!loading &&
          !error &&
          totalElements > 0 && (
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-300">
                    {totalElements}
                  </span>{' '}
                  {totalElements === 1
                    ? 'item'
                    : 'items'}{' '}
                  found
                </p>
              </div>

              {totalPages > 1 && (
                <p className="text-[10px] text-slate-600">
                  Page {page + 1} of{' '}
                  {totalPages}
                </p>
              )}
            </div>
          )}

        {/* Loading */}
        {loading ? (
          <SkeletonLoader
            count={6}
            variant="card"
          />
        ) : error ? (
          /* Error */
          <ErrorState
            title="Unable to load items"
            description="The item registry could not be loaded right now. Please try again."
            actionLabel="Retry"
            onAction={() =>
              fetchItems(page)
            }
          />
        ) : items.length === 0 ? (
          /* Empty */
          <EmptyState
            title="No items found"
            description={
              hasActiveFilters
                ? 'No items match your current filters. Try changing or clearing some filters.'
                : 'There are currently no items available in the registry.'
            }
            actionLabel={
              hasActiveFilters
                ? 'Clear Filters'
                : undefined
            }
            onAction={
              hasActiveFilters
                ? handleResetFilters
                : undefined
            }
          />
        ) : (
          <>
            {/* Item grid/list */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-4'
              }
            >
              {items.map((item) => (
                <ItemCard
                  key={item.itemId}
                  item={item}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={
                  handlePageChange
                }
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
};