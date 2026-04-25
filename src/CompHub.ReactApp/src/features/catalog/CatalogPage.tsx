import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Offcanvas, Row } from 'react-bootstrap';
import { BsFilter } from 'react-icons/bs';
import { useGetProductsQuery } from './productsApi';
import { useGetBrandsQuery } from './brandsApi';
import { useGetCategoriesQuery } from './categoriesApi';
import { useQueryParams } from '../../hooks/useQueryParams';
import useScrollRestore from '../../hooks/useScrollRestore';
import CatalogFilters from './CatalogFilters';
import ActiveFilters from './ActiveFilters';
import ProductCard from './ProductCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { ProductFilterParams } from '../../types/product';

const SORT_OPTIONS: { value: ProductFilterParams['sortBy']; label: string }[] = [
    { value: 'newest', label: 'Новинки' },
    { value: 'price_asc', label: 'Ціна: від дешевих' },
    { value: 'price_desc', label: 'Ціна: від дорогих' },
    { value: 'name', label: 'За назвою' },
];

const SKELETON_COUNT = 12;

const parseFilter = (params: URLSearchParams): ProductFilterParams => ({
    categoryId: params.get('categoryId') ? Number(params.get('categoryId')) : undefined,
    brandIds: params.getAll('brandIds').length > 0
        ? params.getAll('brandIds').map(Number).filter(Boolean)
        : params.get('brandIds')
            ? params.get('brandIds')!.split(',').map(Number).filter(Boolean)
            : undefined,
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    searchTerm: params.get('searchTerm') ?? undefined,
    specifications: (() => {
        const specs: Record<number, string[]> = {};
        for (const key of params.keys()) {
            const match = key.match(/^specifications\[(\d+)\]$/);
            if (!match) continue;
            const keyId = Number(match[1]);
            const values = params.getAll(key).filter(Boolean);
            if (values.length > 0) specs[keyId] = values;
        }
        return Object.keys(specs).length > 0 ? specs : undefined;
    })(),
    inStock: params.get('inStock') === 'true' ? true : undefined,
    sortBy: (params.get('sortBy') as ProductFilterParams['sortBy']) ?? 'newest',
    page: params.get('page') ? Number(params.get('page')) : 1,
    pageSize: 12,
});

const CatalogPage = () => {
    const navigate = useNavigate();
    const { searchParams, setParams } = useQueryParams();
    const filter = parseFilter(searchParams);

    useScrollRestore('catalog');

    const [showFilters, setShowFilters] = useState(false);

    const { data: paged, isLoading, isFetching, isError } = useGetProductsQuery(filter);
    const { data: brands = [] } = useGetBrandsQuery();
    const { data: specFilters = [] } = useGetCategorySpecFiltersQuery(
        filter.categoryId!,
        { skip: !filter.categoryId }
    );
    const { data: categories = [] } = useGetCategoriesQuery();

    // handleFilterChange — виправити brandIds серіалізацію:
    const handleFilterChange = (updates: Partial<ProductFilterParams> & { brandIds?: number[] }): void => {
        const next = new URLSearchParams(searchParams);
        next.set('page', '1');

        if ('specifications' in updates) {
            // Видаляємо всі динамічні ключі specifications[x]
            for (const key of [...next.keys()]) {
                if (/^specifications\[/.test(key)) next.delete(key);
            }
            if (updates.specifications) {
                Object.entries(updates.specifications).forEach(([keyId, values]) => {
                    values.forEach((v) => next.append(`specifications[${keyId}]`, v));
                });
            }
        }
        
        navigate({ search: next.toString() }, { replace: true });
    };

    const handleReset = (): void => {
        navigate({ search: '' }, { replace: true });
    };

    const filtersProps = { filter, onChange: handleFilterChange, onReset: handleReset };

    const activeFilterCount = [
        filter.categoryId ? 1 : 0,
        filter.brandIds?.length ?? 0,
        filter.minPrice ? 1 : 0,
        filter.maxPrice ? 1 : 0,
        filter.inStock ? 1 : 0,
        filter.searchTerm ? 1 : 0,
        Object.values(filter.specifications ?? {}).flat().length,
    ].reduce((a, b) => a + b, 0);

    return (
        <Container>
            <Row className="g-4">
                {/* Sidebar — desktop only */}
                <Col lg={3} className="d-none d-lg-block">
                    <CatalogFilters {...filtersProps} />
                </Col>

                {/* Content */}
                <Col lg={9}>
                    {/* Toolbar — тільки сортування */}
                    <div className="d-flex justify-content-between align-items-center gap-2 mb-3 flex-wrap">
                        {/* Mobile filter button */}
                        <Button
                            variant="outline-secondary"
                            className="d-lg-none d-flex align-items-center gap-2"
                            onClick={() => setShowFilters(true)}
                        >
                            <BsFilter size={18} />
                            Фільтри
                            {activeFilterCount > 0 && (
                                <span className="badge bg-primary rounded-pill ms-1">{activeFilterCount}</span>
                            )}
                        </Button>

                        <div className="ms-auto">
                            <Form.Select
                                style={{ maxWidth: '220px' }}
                                value={filter.sortBy ?? 'newest'}
                                onChange={(e) =>
                                    setParams({ sortBy: e.target.value as ProductFilterParams['sortBy'], page: 1 })
                                }
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>

                    {/* Active filter chips */}
                    <ActiveFilters
                        filter={filter}
                        brands={brands}
                        categories={categories}
                        specFilters={specFilters}
                        onChange={handleFilterChange}
                        onReset={handleReset}
                    />
                    
                    {/* Results count */}
                    {paged && !isLoading && (
                        <p className="text-muted small mb-3">
                            Знайдено товарів: <strong>{paged.totalCount}</strong>
                        </p>
                    )}

                    {/* Grid */}
                    {isError ? (
                        <ErrorAlert />
                    ) : isLoading ? (
                        <Row xs={1} sm={2} md={3} xl={4} className="g-3">
                            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                                <Col key={i}><SkeletonCard /></Col>
                            ))}
                        </Row>
                    ) : !paged || paged.items.length === 0 ? (
                        <EmptyState
                            title="Товарів не знайдено"
                            description="Спробуйте змінити фільтри або пошуковий запит"
                            action={{ label: 'Скинути фільтри', onClick: handleReset }}
                        />
                    ) : (
                        <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                            <Row xs={1} sm={2} md={3} xl={4} className="g-3">
                                {paged.items.map((product) => (
                                    <Col key={product.id}>
                                        <ProductCard product={product} />
                                    </Col>
                                ))}
                            </Row>
                            <Pagination
                                currentPage={filter.page ?? 1}
                                totalPages={paged.totalPages}
                                onPageChange={(page) => setParams({ page })}
                            />
                        </div>
                    )}
                </Col>
            </Row>

            {/* Mobile filters offcanvas */}
            <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="fw-bold">Фільтри</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <CatalogFilters
                        {...filtersProps}
                        onReset={() => { handleReset(); setShowFilters(false); }}
                    />
                </Offcanvas.Body>
            </Offcanvas>
        </Container>
    );
};

export default CatalogPage;