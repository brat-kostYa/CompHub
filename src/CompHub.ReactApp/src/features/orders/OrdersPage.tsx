import { Badge, Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from './ordersApi'
import Spinner from '../../components/common/Spinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
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
    Pending: 'Очікує',
    Processing: 'В обробці',
    Shipped: 'Відправлено',
    Delivered: 'Доставлено',
    Cancelled: 'Скасовано',
};

const OrdersPage = () => {
    const { data: orders = [], isLoading, isError } = useGetMyOrdersQuery();

    if (isLoading) return <Spinner fullPage />;
    if (isError) return <Container className="py-4"><ErrorAlert /></Container>;

    return (
        <Container>
            <h2 className="fw-bold mb-4">Мої замовлення</h2>

            {orders.length === 0 ? (
                <EmptyState
                    title="Замовлень ще немає"
                    description="Оформіть своє перше замовлення в каталозі"
                    action={{ label: 'Перейти до каталогу', to: '/' }}
                />
            ) : (
                <Table responsive hover>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Дата</th>
                            <th>Статус</th>
                            <th className="text-center">Товарів</th>
                            <th className="text-end">Сума</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="align-middle">
                                <td className="fw-semibold">#{order.id}</td>
                                <td className="text-muted">{formatDate(order.createdAt)}</td>
                                <td>
                                    <Badge bg={STATUS_VARIANTS[order.status]}>
                                        {STATUS_LABELS[order.status]}
                                    </Badge>
                                </td>
                                <td className="text-center">{order.itemCount}</td>
                                <td className="text-end fw-semibold">{formatPrice(order.totalAmount)}</td>
                                <td className="text-end">
                                    <Link to={`/orders/${order.id}`} className="btn btn-outline-primary btn-sm">
                                        Деталі
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default OrdersPage;