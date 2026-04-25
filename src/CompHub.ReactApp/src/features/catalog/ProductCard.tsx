import { Badge, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsCartPlus } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addItem } from '../cart/cartSlice';
import { formatPrice, getProductDisplayName } from '../../lib/utils';
import StarDisplay from '../../components/common/StarDisplay';
import type { ProductListItem } from '../../types/product';

interface Props {
    product: ProductListItem;
}

const ProductCard = ({ product }: Props) => {
    const dispatch = useAppDispatch();

    const handleAddToCart = () => {
        dispatch(addItem({ product }));
        toast.success(`«${getProductDisplayName(product.name, product.categoryName)}» додано до кошика`);
    };

    return (
        <Card className="h-100 shadow-sm border-0 product-card">
            <Link to={`/products/${product.id}`}>
                <Card.Img
                    variant="top"
                    src={product.imageUrl ?? '/placeholder.svg'}
                    alt={getProductDisplayName(product.name, product.categoryName)}
                    style={{ height: '180px', objectFit: 'contain', padding: '1rem', background: '#f8f9fa' }}
                />
            </Link>
            <Card.Body className="d-flex flex-column gap-1">
                <small className="text-muted">{product.brandName} · {product.categoryName}</small>
                <Card.Title as="h6" className="mb-0 lh-sm">
                    <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
                        {getProductDisplayName(product.name, product.categoryName)}
                    </Link>
                </Card.Title>

                {product.averageRating != null ? (
                    <div className="d-flex align-items-center gap-1">
                        <StarDisplay rating={product.averageRating} size={12} />
                        <small className="fw-semibold">{product.averageRating.toFixed(1)}</small>
                        <small className="text-muted">({product.reviewCount})</small>
                    </div>
                ) : (
                    <small className="text-muted fst-italic">Без відгуків</small>
                )}

                <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                    <span className="fw-bold fs-5 text-primary">{formatPrice(product.price)}</span>
                    {product.stockQuantity === 0 ? (
                        <Badge bg="secondary">Немає в наявності</Badge>
                    ) : (
                        <Button variant="primary" size="sm" onClick={handleAddToCart} title="Додати до кошика">
                            <BsCartPlus size={16} />
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;