import { Badge, Button } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';
import type { Brand } from '../../types/brand';
import type { Category, SpecFilter } from '../../types/category';
import type { ProductFilterParams } from '../../types/product';

interface Props {
    filter: ProductFilterParams;
    brands: Brand[];
    categories: Category[];
    specFilters?: SpecFilter[];
    onChange: (updates: Partial<ProductFilterParams> & {
        brandIds?: number[];
        specifications?: Record<number, string[]>;
    }) => void;
    onReset: () => void;
}

const ActiveFilters = ({ filter, brands, categories, onChange, onReset }: Props) => {
    const chips: { label: string; onRemove: () => void }[] = [];

    // Category chip
    if (filter.categoryId) {
        const allCats = categories.flatMap((c) => [c, ...c.subCategories]);
        const cat = allCats.find((c) => c.id === filter.categoryId);
        if (cat) {
            chips.push({
                label: cat.name,
                onRemove: () => onChange({ categoryId: undefined, page: 1 }),
            });
        }
    }

    // Brand chips
    (filter.brandIds ?? []).forEach((id) => {
        const brand = brands.find((b) => b.id === id);
        if (brand) {
            chips.push({
                label: brand.name,
                onRemove: () =>
                    onChange({
                        brandIds: (filter.brandIds ?? []).filter((bid) => bid !== id),
                    }),
            });
        }
    });

    // Price chips
    if (filter.minPrice !== undefined) {
        chips.push({
            label: `Від $${filter.minPrice}`,
            onRemove: () => onChange({ minPrice: undefined }),
        });
    }
    if (filter.maxPrice !== undefined) {
        chips.push({
            label: `До $${filter.maxPrice}`,
            onRemove: () => onChange({ maxPrice: undefined }),
        });
    }

    // InStock chip
    if (filter.inStock) {
        chips.push({
            label: 'В наявності',
            onRemove: () => onChange({ inStock: undefined }),
        });
    }

    // Search chip
    if (filter.searchTerm) {
        chips.push({
            label: `Пошук: "${filter.searchTerm}"`,
            onRemove: () => onChange({ searchTerm: undefined, page: 1 } as Partial<ProductFilterParams>),
        });
    }

    // Specification chips
    if (filter.specifications) {
        Object.entries(filter.specifications).forEach(([keyIdStr, values]) => {
            const keyId = Number(keyIdStr);
            const specKey = specFilters.find((sf) => sf.keyId === keyId);

            values.forEach((value) => {
                const label = specKey
                    ? `${specKey.name}: ${value}${specKey.unit ? ` ${specKey.unit}` : ''}`
                    : value;

                chips.push({
                    label,
                    onRemove: () => {
                        const current = filter.specifications ?? {};
                        const remaining = (current[keyId] ?? []).filter((v) => v !== value);
                        const updated = { ...current };

                        if (remaining.length === 0) {
                            delete updated[keyId];
                        } else {
                            updated[keyId] = remaining;
                        }

                        onChange({
                            specifications: Object.keys(updated).length > 0 ? updated : undefined,
                        });
                    },
                });
            });
        });
    }

    if (chips.length === 0) return null;

    return (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <small className="text-muted me-1">Активні фільтри:</small>
            {chips.map(({ label, onRemove }) => (
                <Badge
                    key={label}
                    bg="primary"
                    className="d-inline-flex align-items-center gap-1 px-2 py-1 filter-chip"
                >
                    {label}
                    <BsX
                        size={14}
                        role="button"
                        style={{ cursor: 'pointer' }}
                        onClick={onRemove}
                        aria-label={`Видалити фільтр ${label}`}
                    />
                </Badge>
            ))}
            <Button variant="link" size="sm" className="p-0 text-muted" onClick={onReset}>
                Скинути всі
            </Button>
        </div>
    );
};

export default ActiveFilters;