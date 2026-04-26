import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Badge, Breadcrumb, Button, Col, Container,
    ListGroup, Nav, Row, Table,
} from 'react-bootstrap';
import {
    BsCartPlus, BsDash, BsPlus,
    BsShieldCheck, BsTruck, BsArrowCounterclockwise,
    BsCheckCircleFill, BsHeart, BsColumnsGap,
    BsHeartFill,
} from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useGetProductByIdQuery } from '../catalog/productsApi';
import { useGetReviewsQuery } from './reviewsApi';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addItem } from '../cart/cartSlice';
import { selectIsAuthenticated } from '../auth/authSlice';
import { addRecentlyViewed, selectRecentlyViewed } from './recentlyViewedSlice';
import StarDisplay from '../../components/common/StarDisplay';
import ReviewForm from './ReviewForm';
import Spinner from '../../components/common/Spinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import RelatedProducts from './RelatedProducts';
import ProductCard from '../catalog/ProductCard';
import { formatPrice, formatDate, getProductDisplayName } from '../../lib/utils';
import { selectIsInCompare, selectCompareCount, toggleCompare } from '../compare/compareSlice';
import { selectIsInWishlist, toggleWishlist } from '../wishlist/wishlistSlice';

type TabKey = 'overview' | 'specs' | 'reviews';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const recentlyViewed = useAppSelector(selectRecentlyViewed);

    const productId = id ? parseInt(id, 10) : 0;

    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const [reviewPageSize, setReviewPageSize] = useState(5);

    const tabsRef = useRef<HTMLDivElement>(null);

    const { data: product, isLoading, isError } = useGetProductByIdQuery(productId, { skip: !productId });
    const { data: reviewsPage, isLoading: reviewsLoading } = useGetReviewsQuery(
        { productId, page: 1, pageSize: reviewPageSize },
        { skip: !productId }
    );

    const isWishlisted = useAppSelector(selectIsInWishlist(productId));
    const isCompared = useAppSelector(selectIsInCompare(productId));
    const compareCount = useAppSelector(selectCompareCount);

    useEffect(() => {
        if (!product) return;
        dispatch(addRecentlyViewed({
            id: product.id,
            name: product.name,
            price: product.price,
            stockQuantity: product.stockQuantity,
            imageUrl: product.imageUrl,
            categoryName: product.categoryName,
            brandName: product.brandName,
            averageRating: product.averageRating,
            reviewCount: product.reviewCount,
        }));
    }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAddToCart = (): void => {
        if (!product) return;
        dispatch(addItem({
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                stockQuantity: product.stockQuantity,
                imageUrl: product.imageUrl,
                categoryName: product.categoryName,
                brandName: product.brandName,
                averageRating: product.averageRating,
                reviewCount: product.reviewCount,
            },
            quantity: qty,
        }));
        toast.success(`«${product.name}» × ${qty} додано до кошика`);
    };

    const switchToReviews = (): void => {
        setActiveTab('reviews');
        setTimeout(() => tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    };

    if (!productId) { navigate('/'); return null; }
    if (isLoading) return <Spinner fullPage />;
    if (isError || !product) return (
        <Container className="py-4">
            <ErrorAlert message="Товар не знайдено або сталася помилка." />
        </Container>
    );

    const inStock = product.stockQuantity > 0;
    const hasMoreReviews = reviewsPage ? reviewsPage.totalCount > reviewPageSize : false;
    const recentItems = recentlyViewed.filter((p) => p.id !== productId).slice(0, 4);

    return (
        <Container className="py-3">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-2 product-breadcrumb">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Головна</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/catalog?categoryId=${product.categoryId}` }}>
                    {product.categoryName}
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-truncate" style={{ maxWidth: '260px' }}>
                    {product.name}
                </Breadcrumb.Item>
            </Breadcrumb>

            {/* Compact product header — видно над усіма табами */}
            <div className="product-compact-header mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                    {product.brandLogoUrl && (
                        <img
                            src={product.brandLogoUrl}
                            alt={product.brandName}
                            style={{ height: '24px', width: 'auto', objectFit: 'contain' }}
                        />
                    )}
                    <Badge bg="light" text="dark" className="brand-badge">{product.brandName}</Badge>
                </div>
                <h1 className="h3 fw-bold mb-2 lh-sm">{getProductDisplayName(product.name, product.categoryName)}</h1>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                    {product.averageRating != null ? (
                        <>
                            <StarDisplay rating={product.averageRating} size={14} />
                            <button
                                className="btn btn-link p-0 text-muted small text-decoration-none"
                                onClick={switchToReviews}
                            >
                                {product.averageRating.toFixed(1)} · {product.reviewCount} відгук{product.reviewCount === 1 ? '' : product.reviewCount < 5 ? 'и' : 'ів'}
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-link p-0 text-muted small text-decoration-none"
                            onClick={switchToReviews}
                        >
                            Написати перший відгук
                        </button>
                    )}
                    {inStock
                        ? <span className="d-inline-flex align-items-center gap-1 text-success small fw-semibold">
                            <BsCheckCircleFill size={13} /> В наявності
                          </span>
                        : <span className="text-secondary small fw-semibold">Немає в наявності</span>
                    }
                </div>
            </div>

            {/* Tabs navigation */}
            <div ref={tabsRef}>
                <Nav variant="tabs" className="product-tabs mb-0" activeKey={activeTab}>
                    <Nav.Item>
                        <Nav.Link eventKey="overview" onClick={() => setActiveTab('overview')}>
                            Огляд
                        </Nav.Link>
                    </Nav.Item>
                    {product.specifications.length > 0 && (
                        <Nav.Item>
                            <Nav.Link eventKey="specs" onClick={() => setActiveTab('specs')}>
                                Характеристики
                                <Badge bg="secondary" className="ms-2" pill>
                                    {product.specifications.length}
                                </Badge>
                            </Nav.Link>
                        </Nav.Item>
                    )}
                    <Nav.Item>
                        <Nav.Link eventKey="reviews" onClick={() => setActiveTab('reviews')}>
                            Відгуки
                            {product.reviewCount > 0 && (
                                <Badge bg="secondary" className="ms-2" pill>{product.reviewCount}</Badge>
                            )}
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <div className="tab-content-panel">

                    {/* ── Overview ── */}
                    {activeTab === 'overview' && (
                        <div className="py-4">
                            <Row className="g-4 mb-5">
                                {/* Image */}
                                <Col md={5}>
                                    <div className="product-detail-image-wrap rounded-3">
                                        <img
                                            src={product.imageUrl ?? '/placeholder.svg'}
                                            alt={getProductDisplayName(product.name, product.categoryName)}
                                            className="product-detail-image"
                                        />
                                    </div>
                                </Col>

                                {/* Purchase panel */}
                                <Col md={7}>
                                    <div className="purchase-panel">
                                        {/* Brand + Brand logo + Product name*/}
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            {product.brandLogoUrl && (
                                                <img
                                                    src={product.brandLogoUrl}
                                                    alt={product.brandName}
                                                    style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
                                                    className="rounded"
                                                />
                                            )}
                                            <Badge bg="light" text="dark" className="brand-badge">{product.brandName}</Badge>
                                        </div>
                                        <h1 className="h3 fw-bold mb-2 lh-sm">{getProductDisplayName(product.name, product.categoryName)}</h1>

                                        {/* Price */}
                                        <div className="d-flex align-items-baseline gap-3 mb-1 flex-wrap">
                                            <span className="product-price">{formatPrice(product.price)}</span>
                                        </div>

                                        {/* Availability */}
                                        {inStock ? (
                                            <div className="d-flex align-items-center gap-1 text-success mb-4 small fw-semibold">
                                                <BsCheckCircleFill size={14} />
                                                В наявності · {product.stockQuantity} шт.
                                            </div>
                                        ) : (
                                            <div className="text-secondary mb-4 small fw-semibold">
                                                Немає в наявності
                                            </div>
                                        )}

                                        {/* Qty + Add to cart */}
                                        {inStock && (
                                            <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                                                <div className="qty-stepper d-flex align-items-center border rounded-2">
                                                    <button
                                                        className="btn btn-link text-dark px-3 py-2"
                                                        disabled={qty <= 1}
                                                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                                                        aria-label="Зменшити"
                                                    >
                                                        <BsDash />
                                                    </button>
                                                    <span className="fw-semibold px-2" style={{ minWidth: '32px', textAlign: 'center' }}>
                                                        {qty}
                                                    </span>
                                                    <button
                                                        className="btn btn-link text-dark px-3 py-2"
                                                        disabled={qty >= product.stockQuantity}
                                                        onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))}
                                                        aria-label="Збільшити"
                                                    >
                                                        <BsPlus />
                                                    </button>
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    size="lg"
                                                    onClick={handleAddToCart}
                                                    className="d-flex align-items-center gap-2 flex-grow-1 flex-sm-grow-0 justify-content-center"
                                                >
                                                    <BsCartPlus size={20} />
                                                    Додати до кошика
                                                </Button>
                                            </div>
                                        )}

                                        {/* Secondary actions */}
                                        <Button
                                            variant={isWishlisted ? 'danger' : 'outline-secondary'}
                                            size="sm"
                                            className="d-flex align-items-center gap-1"
                                            onClick={() => {
                                                if (!product) return;
                                                dispatch(toggleWishlist({ id: product.id, name: product.name, price: product.price, stockQuantity: product.stockQuantity, imageUrl: product.imageUrl, categoryName: product.categoryName, brandName: product.brandName, averageRating: product.averageRating, reviewCount: product.reviewCount }));
                                                toast[isWishlisted ? 'info' : 'success'](isWishlisted ? 'Видалено з бажаного' : 'Додано до бажаного');
                                            }}
                                        >
                                            {isWishlisted ? <BsHeartFill size={14} /> : <BsHeart size={14} />}
                                            {isWishlisted ? 'В обраному' : 'В обране'}
                                        </Button>
                                        <Button
                                            variant={isCompared ? 'primary' : 'outline-secondary'}
                                            size="sm"
                                            className="d-flex align-items-center gap-1"
                                            onClick={() => {
                                                if (!product) return;
                                                if (!isCompared && compareCount >= 4) { toast.warning('Максимум 4 товари'); return; }
                                                dispatch(toggleCompare({ id: product.id, name: product.name, price: product.price, stockQuantity: product.stockQuantity, imageUrl: product.imageUrl, categoryName: product.categoryName, brandName: product.brandName, averageRating: product.averageRating, reviewCount: product.reviewCount }));
                                                toast[isCompared ? 'info' : 'success'](isCompared ? 'Видалено з порівняння' : 'Додано до порівняння');
                                            }}
                                        >
                                            <BsColumnsGap size={14} /> Порівняти
                                        </Button>

                                        {/* Trust badges */}
                                        <div className="trust-grid">
                                            <div className="trust-badge">
                                                <BsTruck size={16} className="text-primary" />
                                                <span>Доставка по Україні</span>
                                            </div>
                                            <div className="trust-badge">
                                                <BsShieldCheck size={16} className="text-primary" />
                                                <span>Офіційна гарантія</span>
                                            </div>
                                            <div className="trust-badge">
                                                <BsArrowCounterclockwise size={16} className="text-primary" />
                                                <span>Повернення 14 днів</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* Description */}
                            {product.description && (
                                <div className="product-description mb-4">
                                    <h5 className="section-label mb-3">Опис</h5>
                                    <p className="text-muted lh-lg mb-0" style={{ maxWidth: '780px' }}>
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Short specs preview */}
                            {product.specifications.length > 0 && (
                                <div>
                                    <h5 className="section-label mb-3">Основні характеристики</h5>
                                    <Row xs={2} sm={2} lg={3} xl={4} className="g-3 mb-3">
                                        {product.specifications.slice(0, 8).map((spec) => (
                                            <Col key={spec.key}>
                                                <div className="spec-card">
                                                    <div className="spec-card-label">{spec.key}</div>
                                                    <div className="spec-card-value">
                                                        {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                    {product.specifications.length > 8 && (
                                        <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('specs')}>
                                            Всі характеристики ({product.specifications.length})
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Specs ── */}
                    {activeTab === 'specs' && (
                        <div className="py-4">
                            <Table bordered responsive size="sm" className="specs-table mb-0">
                                <tbody>
                                    {product.specifications.map((spec) => (
                                        <tr key={spec.key}>
                                            <td className="specs-table-label">{spec.key}</td>
                                            <td>{spec.value}{spec.unit ? ` ${spec.unit}` : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {/* ── Reviews ── */}
                    {activeTab === 'reviews' && (
                        <div className="py-4">
                            {product.reviewCount > 0 && product.averageRating != null && (
                                <div className="rating-summary mb-4">
                                    <div className="rating-summary-score">{product.averageRating.toFixed(1)}</div>
                                    <div>
                                        <StarDisplay rating={product.averageRating} size={22} />
                                        <div className="text-muted small mt-1">
                                            На основі {product.reviewCount} відгук{product.reviewCount === 1 ? 'у' : 'ів'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {reviewsLoading ? (
                                <Spinner />
                            ) : reviewsPage && reviewsPage.items.length > 0 ? (
                                <>
                                    <ListGroup variant="flush" className="reviews-list mb-3">
                                        {reviewsPage.items.map((review) => (
                                            <ListGroup.Item key={review.id} className="px-0 py-3">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="review-avatar">
                                                            {review.userFullName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="fw-semibold small">{review.userFullName}</div>
                                                            <StarDisplay rating={review.rating} size={13} />
                                                        </div>
                                                    </div>
                                                    <small className="text-muted">{formatDate(review.createdAt)}</small>
                                                </div>
                                                {review.comment && (
                                                    <p className="mb-0 text-muted ps-5 lh-base">{review.comment}</p>
                                                )}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                    {hasMoreReviews && (
                                        <Button variant="outline-secondary" size="sm"
                                            onClick={() => setReviewPageSize((s) => s + 5)}>
                                            Показати більше відгуків
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <p className="text-muted fst-italic">Поки що відгуків немає. Будьте першим!</p>
                            )}

                            <div className="mt-4 pt-4 border-top">
                                {isAuthenticated ? (
                                    <>
                                        <h6 className="fw-bold mb-3">Залишити відгук</h6>
                                        <ReviewForm productId={productId} />
                                    </>
                                ) : (
                                    <p className="text-muted fst-italic mb-0">
                                        <Link to="/login">Увійдіть</Link>, щоб залишити відгук.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recently viewed */}
            {recentItems.length > 0 && (
                <section className="mt-5">
                    <h4 className="section-heading mb-3">Нещодавно переглянуті</h4>
                    <Row xs={2} md={4} className="g-3">
                        {recentItems.map((p) => (
                            <Col key={p.id}><ProductCard product={p} /></Col>
                        ))}
                    </Row>
                </section>
            )}

            {/* Related products */}
            <RelatedProducts categoryId={product.categoryId} currentProductId={productId} />
        </Container>
    );
};

export default ProductDetailPage;