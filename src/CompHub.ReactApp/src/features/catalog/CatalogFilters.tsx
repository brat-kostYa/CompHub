import { Accordion, Badge, Button, Form, Spinner } from 'react-bootstrap';
import { BsCheck2, BsSearch } from 'react-icons/bs';
import { useGetBrandsQuery } from './brandsApi';
import { useGetCategoryBrandsQuery } from './categoriesApi';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';
import type { ProductFilterParams } from '../../types/product';

interface Props {
    filter: ProductFilterParams;
    onChange: (updates: Partial<ProductFilterParams> & { brandIds?: number[] }) => void;
    onReset: () => void;
}

const CatalogFilters = ({ filter, onChange, onReset }: Props) => {
    const { data: allBrands = [], isLoading: allBrandsLoading } = useGetBrandsQuery();
    const { data: categoryBrands, isLoading: categoryBrandsLoading } = useGetCategoryBrandsQuery(
        filter.categoryId!,
        { skip: !filter.categoryId }
    );

    const brands = filter.categoryId ? (categoryBrands ?? []) : allBrands;
    const brandLoading = filter.categoryId ? categoryBrandsLoading : allBrandsLoading;

    const [minInput, setMinInput] = useState(filter.minPrice?.toString() ?? '');
    const [maxInput, setMaxInput] = useState(filter.maxPrice?.toString() ?? '');
    const [brandSearch, setBrandSearch] = useState('');

    const debouncedMin = useDebounce(minInput, 500);
    const debouncedMax = useDebounce(maxInput, 500);

    useEffect(() => {
        const val = debouncedMin === '' ? undefined : Number(debouncedMin);
        if (val !== filter.minPrice) onChange({ minPrice: val });
    }, [debouncedMin]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const val = debouncedMax === '' ? undefined : Number(debouncedMax);
        if (val !== filter.maxPrice) onChange({ maxPrice: val });
    }, [debouncedMax]); // eslint-disable-line react-hooks/exhaustive-deps

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
    const priceLabel =
        minInput || maxInput
            ? `${minInput ? Number(minInput).toLocaleString('uk-UA') + ' ₴' : ''
            }${minInput && maxInput ? ' — ' : ''
            }${maxInput ? Number(maxInput).toLocaleString('uk-UA') + ' ₴' : ''}`
            : null;

    return (
        <div className="catalog-filters">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Фільтри</span>
                <Button variant="link" size="sm" className="p-0 text-muted text-decoration-none" onClick={onReset}>
                    Скинути всі
                </Button>
            </div>

            <Accordion defaultActiveKey={['0', '1']} alwaysOpen flush>
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
                            <small className="text-muted">Немає брендів для цієї категорії</small>
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
                    <Accordion.Header>
                        <span className="d-flex flex-column w-100 me-2">
                            <span>Ціна</span>
                            {priceLabel && (
                                <small className="text-primary fw-normal" style={{ fontSize: '0.75rem' }}>
                                    {priceLabel}
                                </small>
                            )}
                        </span>
                    </Accordion.Header>
                    <Accordion.Body className="px-0 pt-2">
                        <div className="d-flex align-items-center gap-2">
                            <Form.Control type="number" placeholder="Від, ₴" size="sm" min={0}
                                value={minInput} onChange={(e) => setMinInput(e.target.value)} />
                            <span className="text-muted flex-shrink-0">—</span>
                            <Form.Control type="number" placeholder="До, ₴" size="sm" min={0}
                                value={maxInput} onChange={(e) => setMaxInput(e.target.value)} />
                        </div>
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
            </Accordion>
        </div>
    );
};

export default CatalogFilters;