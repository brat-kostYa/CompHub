import { Badge, Button, Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsColumnsGap, BsTrash, BsX } from 'react-icons/bs';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectCompareItems, removeFromCompare, clearCompare } from './compareSlice';
import { useCompareProducts } from '../../hooks/useCompareProducts';
import { formatPrice } from '../../lib/utils';
import StarDisplay from '../../components/common/StarDisplay';
import EmptyState from '../../components/common/EmptyState';
import type { JSX } from 'react';
import type { ProductDetail } from '../../types/product';

// =============== Helpers ===============

const buildSpecKeys = (products: (ProductDetail | undefined)[]): string[] =>
    Array.from(
        new Set(
            products
                .filter((p): p is ProductDetail => p !== undefined)
                .flatMap((p) => p.specifications.map((s) => s.key))
        )
    );

const getSpecValue = (product: ProductDetail | undefined, key: string): string =>
    product?.specifications.find((s) => s.key === key)
        ? `${product.specifications.find((s) => s.key === key)!.value}${product.specifications.find((s) => s.key === key)!.unit ? ` ${product.specifications.find((s) => s.key === key)!.unit}` : ''}`
        : '—';

// =============== Page ===============

const ComparePage = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectCompareItems);
    const products = useCompareProducts(items.map((i) => i.id));
    const specKeys = buildSpecKeys(products);

    if (items.length === 0) {
        return (
            <Container className="py-4">
                <EmptyState
                    icon={<BsColumnsGap />}
                    title="Немає товарів для порівняння"
                    description="Додайте до 4 товарів для порівняння характеристик"
                    action={{ label: 'Перейти до каталогу', to: '/catalog' }}
                />
            </Container>
        );
    }

    return (
        <Container fluid="lg">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Порівняння товарів</h2>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="d-flex align-items-center gap-2"
                    onClick={() => dispatch(clearCompare())}
                >
                    <BsTrash size={14} /> Очистити
                </Button>
            </div>

            <div className="table-responsive">
                <Table bordered className="compare-table">
                    <thead>
                        <tr>
                            <th className="compare-label-cell" />
                            {items.map((item, idx) => {
                                const product = products[idx];
                                return (
                                    <th key={item.id} className="compare-product-cell text-center position-relative">
                                        <button
                                            className="btn btn-link text-danger p-0 position-absolute top-0 end-0 m-1"
                                            onClick={() => dispatch(removeFromCompare(item.id))}
                                            aria-label={`Видалити ${item.name}`}
                                        >
                                            <BsX size={20} />
                                        </button>
                                        {product ? (
                                            <>
                                                <Link to={`/products/${item.id}`}>
                                                    <img
                                                        src={product.imageUrl ?? '/placeholder.svg'}
                                                        alt={product.name}
                                                        className="compare-product-img"
                                                    />
                                                </Link>
                                                <div className="fw-semibold small lh-sm mb-1">
                                                    <Link to={`/products/${item.id}`} className="text-dark text-decoration-none">
                                                        {product.name}
                                                    </Link>
                                                </div>
                                                <div className="text-muted small">{product.brandName}</div>
                                                {product.averageRating != null && (
                                                    <div className="d-flex align-items-center justify-content-center gap-1 my-1">
                                                        <StarDisplay rating={product.averageRating} size={12} />
                                                        <small>{product.averageRating.toFixed(1)}</small>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="py-3 text-muted small">Завантаження...</div>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Price */}
                        <tr>
                            <td className="compare-label-cell fw-semibold">Ціна</td>
                            {products.map((p, idx) => (
                                <td key={items[idx].id} className="text-center fw-bold text-primary">
                                    {p ? formatPrice(p.price) : '—'}
                                </td>
                            ))}
                        </tr>
                        {/* Stock */}
                        <tr>
                            <td className="compare-label-cell fw-semibold">Наявність</td>
                            {products.map((p, idx) => (
                                <td key={items[idx].id} className="text-center">
                                    {p == null ? '—' : p.stockQuantity > 0
                                        ? <Badge bg="success">В наявності</Badge>
                                        : <Badge bg="secondary">Немає</Badge>
                                    }
                                </td>
                            ))}
                        </tr>
                        {/* Specs */}
                        {specKeys.map((key) => (
                            <tr key={key}>
                                <td className="compare-label-cell fw-semibold">{key}</td>
                                {products.map((p, idx) => (
                                    <td key={items[idx].id} className={`text-center ${!p || getSpecValue(p, key) === '—' ? 'text-muted' : ''}`}>
                                        {p ? getSpecValue(p, key) : '—'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default ComparePage;