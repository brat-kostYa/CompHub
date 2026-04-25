import { Badge, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { useGetOrderByIdQuery } from './ordersApi';
import Spinner from '../../components/common/Spinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { formatPrice, formatDate } from '../../lib/utils'
import type { OrderStatus } from '../../types/order';

const STATUS_VARIANTS: Record<OrderStatus, string> = {
    Pending: 'secondary',
    Processing: 'warning',
    Shipped: 'info',
    Delivered: 'success',
    Cancelled: 'danger',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
    Pending: 'Очікує підтвердження',
    Processing: 'В обробці',
    Shipped: 'Відправлено',
    Delivered: 'Доставлено',
    Cancelled: 'Скасовано',
};

const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const orderId = id ? parseInt(id, 10) : 0;

    const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId, { skip: !orderId });

    if (!orderId) {
        navigate('/orders');
        return null;
    }

    if (isLoading) return <Spinner fullPage />;
    if (isError || !order) {
        return (
            <Container className="py-4">
                <ErrorAlert message="Замовлення не знайдено." />
            </Container>
        );
    }

    return (
        <Container>
            <Link
                to="/orders"
                className="text-muted text-decoration-none d-inline-flex align-items-center gap-1 mb-3"
            >
                <BsArrowLeft /> Назад до замовлень
            </Link>

            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
                <div>
                    <h2 className="fw-bold mb-1">Замовлення #{order.id}</h2>
                    <small className="text-muted">від {formatDate(order.createdAt)}</small>
                </div>
                <Badge bg={STATUS_VARIANTS[order.status]} className="fs-6 px-3 py-2">
                    {STATUS_LABELS[order.status]}
                </Badge>
            </div>

            <Row className="g-4">
                <Col lg={8}>
                    <h5 className="fw-bold mb-3">Товари</h5>
                    <ListGroup variant="flush" className="border rounded-3">
                        {order.items.map((item) => (
                            <ListGroup.Item key={item.productId} className="py-3">
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={item.productImageUrl ?? '/placeholder.svg'}
                                        alt={item.productName}
                                        style={{ width: '56px', height: '56px', objectFit: 'contain' }}
                                        className="bg-light rounded p-1"
                                    />
                                    <div className="flex-grow-1">
                                        <Link
                                            to={`/products/${item.productId}`}
                                            className="fw-semibold text-dark text-decoration-none"
                                        >
                                            {item.productName}
                                        </Link>
                                        <div className="text-muted small">
                                            {formatPrice(item.unitPrice)} × {item.quantity}
                                        </div>
                                    </div>
                                    <span className="fw-bold">{formatPrice(item.subtotal)}</span>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                <Col lg={4}>
                    <h5 className="fw-bold mb-3">Деталі</h5>
                    <div className="border rounded-3 p-3 d-flex flex-column gap-2">
                        <div>
                            <small className="text-muted d-block">Адреса доставки</small>
                            <span>{order.shippingCity}, {order.shippingAddress}</span>
                        </div>
                        <hr className="my-1" />
                        <div className="d-flex justify-content-between fw-bold fs-5">
                            <span>Разом:</span>
                            <span className="text-primary">{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderDetailPage;