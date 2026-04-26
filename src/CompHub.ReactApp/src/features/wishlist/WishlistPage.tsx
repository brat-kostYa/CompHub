import { Container, Row, Col, Button } from 'react-bootstrap';
import { BsHeartFill, BsTrash } from 'react-icons/bs';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectWishlistItems, clearWishlist } from './wishlistSlice';
import ProductCard from '../catalog/ProductCard';
import EmptyState from '../../components/common/EmptyState';

const WishlistPage = () => {
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectWishlistItems);

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Список бажаного</h2>
                {items.length > 0 && (
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="d-flex align-items-center gap-2"
                        onClick={() => dispatch(clearWishlist())}
                    >
                        <BsTrash size={14} /> Очистити список
                    </Button>
                )}
            </div>

            {items.length === 0 ? (
                <EmptyState
                    icon={<BsHeartFill />}
                    title="Список бажаного порожній"
                    description="Додавайте товари до списку, натискаючи на іконку серця"
                    action={{ label: 'Перейти до каталогу', to: '/catalog' }}
                />
            ) : (
                <Row xs={1} sm={2} md={3} xl={4} className="g-3">
                    {items.map((product) => (
                        <Col key={product.id}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default WishlistPage;