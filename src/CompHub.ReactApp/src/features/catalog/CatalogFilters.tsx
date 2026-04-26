import { Accordion, Badge, Button, Form, Spinner } from 'react-bootstrap';
import { BsCheck2, BsSearch } from 'react-icons/bs';
import { useGetBrandsQuery } from './brandsApi';
import { useGetCategoryBrandsQuery, useGetCategorySpecFiltersQuery } from './categoriesApi';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';
import type { ProductFilterParams } from '../../types/product';

// =============== Constants ===============

const PRICE_MIN = 0;
const PRICE_MAX = 100000;
const PRICE_STEP = 500;

// =============== Price range slider ===============

interface PriceRangeSliderProps {
    minPrice?: number;
    maxPrice?: number;
    onChange: (min: number | undefined, max: number | undefined) => void;
}

const PriceRangeSlider = ({ minPrice, maxPrice, onChange }: PriceRangeSliderProps) => {
    const [localMin, setLocalMin] = useState(minPrice ?? PRICE_MIN);
    const [localMax, setLocalMax] = useState(maxPrice ?? PRICE_MAX);

    const debouncedMin = useDebounce(localMin, 400);
    const debouncedMax = useDebounce(localMax, 400);

    // Sync when external reset (both become undefined)
    useEffect(() => {
        if (minPrice === undefined && maxPrice === undefined) {
            setLocalMin(PRICE_MIN);
            setLocalMax(PRICE_MAX);
        }
    }, [minPrice, maxPrice]);

    useEffect(() => {
        const val = debouncedMin === PRICE_MIN ? undefined : debouncedMin;
        if (val !== minPrice) onChange(val, maxPrice);
    }, [debouncedMin]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const val = debouncedMax === PRICE_MAX ? undefined : debouncedMax;
        if (val !== maxPrice) onChange(minPrice, val);
    }, [debouncedMax]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const val = Math.min(Number(e.target.value), localMax - PRICE_STEP);
        setLocalMin(val);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const val = Math.max(Number(e.target.value), localMin + PRICE_STEP);
        setLocalMax(val);
    };

    const minPercent = ((localMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
    const maxPercent = ((localMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

    return (
        <div>
            <div className="price-slider-wrapper">
                <div className="price-slider-track">
                    <div
                        className="price-slider-range"
                        style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                    />
                </div>
                <input
                    type="range"
                    className="price-slider-thumb"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={localMin}
                    onChange={handleMinChange}
                />
                <input
                    type="range"
                    className="price-slider-thumb"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={localMax}
                    onChange={handleMaxChange}
                />
            </div>
            <div className="d-flex justify-content-between mt-2">
                <span className="price-slider-label">
                    {localMin === PRICE_MIN ? 'Від' : `${localMin.toLocaleString('uk-UA')} ₴`}
                </span>
                <span className="price-slider-label">
                    {localMax === PRICE_MAX ? 'До' : `${localMax.toLocaleString('uk-UA')} ₴`}
                </span>
            </div>
        </div>
    );
};

// =============== Main component ===============

interface Props {
    filter: ProductFilterParams;
    onChange: (updates: Partial<ProductFilterParams> & {
        brandIds?: number[];
        specifications?: Record<number, string[]>;
    }) => void;
    onReset: () => void;
}

const CatalogFilters = ({ filter, onChange, onReset }: Props) => {
    const { data: allBrands = [], isLoading: allBrandsLoading } = useGetBrandsQuery();
    const { data: categoryBrands, isLoading: categoryBrandsLoading } = useGetCategoryBrandsQuery(
        filter.categoryId!,
        { skip: !filter.categoryId }
    );
    const { data: specFilters = [] } = useGetCategorySpecFiltersQuery(
        filter.categoryId!,
        { skip: !filter.categoryId }
    );

    const brands = filter.categoryId ? (categoryBrands ?? []) : allBrands;
    const brandLoading = filter.categoryId ? categoryBrandsLoading : allBrandsLoading;

    const [brandSearch, setBrandSearch] = useState('');

    // Скинути бренд-фільтр якщо вибраний бренд недоступний у новій категорії
    useEffect(() => {
        if (!filter.categoryId || !categoryBrands || !filter.brandIds?.length) return;
        const availableIds = new Set(categoryBrands.map((b) => b.id));
        const valid = filter.brandIds.filter((id) => availableIds.has(id));
        if (valid.length !== filter.brandIds.length) {
            onChange({ brandIds: valid.length > 0 ? valid : undefined });
        }
    }, [categoryBrands]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleBrandToggle = (brandId: number): void => {
        const current = filter.brandIds ?? [];
        const next = current.includes(brandId)
            ? current.filter((id) => id !== brandId)
            : [...current, brandId];
        onChange({ brandIds: next.length > 0 ? next : undefined });
    };

    const handleSpecToggle = (keyId: number, value: string): void => {
        const current = filter.specifications ?? {};
        const existing = current[keyId] ?? [];

        const nextValues = existing.includes(value)
            ? existing.filter((v) => v !== value)
            : [...existing, value];

        const updated = { ...current };
        if (nextValues.length === 0) {
            delete updated[keyId];
        } else {
            updated[keyId] = nextValues;
        }

        onChange({
            specifications: Object.keys(updated).length > 0 ? updated : undefined,
        });
    };

    const filteredBrands = brands.filter((b) =>
        b.name.toLowerCase().includes(brandSearch.toLowerCase())
    );

    const activeBrandCount = filter.brandIds?.length ?? 0;
    const activeSpecCount = Object.values(filter.specifications ?? {}).flat().length;

    return (
        <div className="catalog-filters">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Фільтри</span>
                <Button variant="link" size="sm" className="p-0 text-muted text-decoration-none" onClick={onReset}>
                    Скинути всі
                </Button>
            </div>

            <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen flush>

                {/* Бренд */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <span className="d-flex align-items-center gap-2 w-100 me-2">
                            Бренд
                            {activeBrandCount > 0 && <Badge bg="primary" pill>{activeBrandCount}</Badge>}
                        </span>
                    </Accordion.Header>
                    <Accordion.Body className="px-0 pt-1">
                        {brandLoading ? (
                            <Spinner size="sm" animation="border" />
                        ) : brands.length === 0 ? (
                            <small className="text-muted">
                                {filter.categoryId
                                    ? 'Немає брендів для цієї категорії'
                                    : 'Оберіть категорію для фільтрації брендів'}
                            </small>
                        ) : (
                            <>
                                {brands.length > 6 && (
                                    <div className="input-group input-group-sm mb-2">
                                        <span className="input-group-text border-end-0 bg-transparent">
                                            <BsSearch size={12} className="text-muted" />
                                        </span>
                                        <Form.Control
                                            className="border-start-0"
                                            placeholder="Пошук бренду..."
                                            value={brandSearch}
                                            onChange={(e) => setBrandSearch(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="filter-brand-list">
                                    {filteredBrands.map((brand) => {
                                        const checked = (filter.brandIds ?? []).includes(brand.id);
                                        return (
                                            <div
                                                key={brand.id}
                                                className={`filter-brand-item ${checked ? 'active' : ''}`}
                                                onClick={() => handleBrandToggle(brand.id)}
                                            >
                                                <span className={`filter-checkbox ${checked ? 'checked' : ''}`}>
                                                    {checked && <BsCheck2 size={11} />}
                                                </span>
                                                {brand.name}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </Accordion.Body>
                </Accordion.Item>

                {/* Ціна */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Ціна</Accordion.Header>
                    <Accordion.Body className="px-0 pt-2 pb-1">
                        <PriceRangeSlider
                            minPrice={filter.minPrice}
                            maxPrice={filter.maxPrice}
                            onChange={(min, max) => onChange({ minPrice: min, maxPrice: max })}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                {/* Наявність */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Наявність</Accordion.Header>
                    <Accordion.Body className="px-0">
                        <div
                            className={`filter-toggle-pill ${filter.inStock ? 'active' : ''}`}
                            onClick={() => onChange({ inStock: filter.inStock ? undefined : true, page: 1 })}
                        >
                            {filter.inStock && <BsCheck2 className="me-1" />}
                            Тільки в наявності
                        </div>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Характеристики — тільки якщо обрана категорія */}
                {filter.categoryId && specFilters.length > 0 && (
                    <>
                        {specFilters.map((sf, idx) => {
                            const activeValues = filter.specifications?.[sf.keyId] ?? [];
                            return (
                                <Accordion.Item key={sf.keyId} eventKey={`spec-${idx + 3}`}>
                                    <Accordion.Header>
                                        <span className="d-flex align-items-center gap-2 w-100 me-2">
                                            {sf.name}{sf.unit ? `, ${sf.unit}` : ''}
                                            {activeValues.length > 0 && (
                                                <Badge bg="primary" pill>{activeValues.length}</Badge>
                                            )}
                                        </span>
                                    </Accordion.Header>
                                    <Accordion.Body className="px-0 pt-1">
                                        <div className="filter-brand-list">
                                            {sf.values.map((val) => {
                                                const checked = activeValues.includes(val);
                                                return (
                                                    <div
                                                        key={val}
                                                        className={`filter-brand-item ${checked ? 'active' : ''}`}
                                                        onClick={() => handleSpecToggle(sf.keyId, val)}
                                                    >
                                                        <span className={`filter-checkbox ${checked ? 'checked' : ''}`}>
                                                            {checked && <BsCheck2 size={11} />}
                                                        </span>
                                                        {val}{sf.unit ? ` ${sf.unit}` : ''}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            );
                        })}
                    </>
                )}
            </Accordion>

            {/* Підказка якщо немає категорії */}
            {!filter.categoryId && activeSpecCount === 0 && (
                <p className="text-muted small mt-3 mb-0 fst-italic">
                    Оберіть категорію у каталозі для фільтрації за характеристиками
                </p>
            )}
        </div>
    );
};

export default CatalogFilters;