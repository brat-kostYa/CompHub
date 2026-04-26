import { Badge, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsCartPlus, BsColumnsGap, BsHeart, BsHeartFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addItem } from '../cart/cartSlice';
import { formatPrice, getProductDisplayName } from '../../lib/utils';
import StarDisplay from '../../components/common/StarDisplay';
import type { ProductListItem } from '../../types/product';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectIsInCompare, selectCompareCount, toggleCompare } from '../compare/compareSlice';
import { selectIsInWishlist, toggleWishlist } from '../wishlist/wishlistSlice';

interface Props {
    product: ProductListItem;
}

const ProductCard = ({ product }: Props) => {
    const dispatch = useAppDispatch();

    const isWishlisted = useAppSelector(selectIsInWishlist(product.id));
    const isCompared = useAppSelector(selectIsInCompare(product.id));
    const compareCount = useAppSelector(selectCompareCount);

    const handleAddToCart = () => {
        dispatch(addItem({ product }));
        toast.success(`«${getProductDisplayName(product.name, product.categoryName)}» додано до кошика`);
    };

    const handleWishlist = (): void => {
        dispatch(toggleWishlist(product));
        toast[isWishlisted ? 'info' : 'success'](
            isWishlisted
                ? `«${getProductDisplayName(product.name, product.categoryName)}» видалено з бажаного`
                : `«${getProductDisplayName(product.name, product.categoryName)}» додано до бажаного`
        );
    };

    const handleCompare = (): void => {
        if (!isCompared && compareCount >= 4) {
            toast.warning('Можна порівнювати не більше 4 товарів');
            return;
        }
        dispatch(toggleCompare(product));
        toast[isCompared ? 'info' : 'success'](
            isCompared
                ? `«${getProductDisplayName(product.name, product.categoryName)}» видалено з порівняння`
                : `«${getProductDisplayName(product.name, product.categoryName)}» додано до порівняння`
        );
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

                {/* Wishlist + Compare action row */}
                <div className="d-flex gap-1 mt-1">
                    <Button
                        variant="link"
                        size="sm"
                        className={`p-0 me-1 ${isWishlisted ? 'text-danger' : 'text-muted'}`}
                        onClick={handleWishlist}
                        title={isWishlisted ? 'Видалити з бажаного' : 'Додати до бажаного'}
                    >
                        {isWishlisted ? <BsHeartFill size={14} /> : <BsHeart size={14} />}
                    </Button>
                    <Button
                        variant="link"
                        size="sm"
                        className={`p-0 ${isCompared ? 'text-primary' : 'text-muted'}`}
                        onClick={handleCompare}
                        title={isCompared ? 'Видалити з порівняння' : 'Додати до порівняння'}
                    >
                        <BsColumnsGap size={14} />
                    </Button>
                </div>

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