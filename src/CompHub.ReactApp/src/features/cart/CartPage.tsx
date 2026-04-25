import { Button, Col, Container, Image, Row, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
    selectCartItems,
    selectCartTotalPrice,
    removeItem,
    updateQuantity,
    addItem,
} from './cartSlice';
import { formatPrice } from '../../lib/utils';
import EmptyState from '../../components/common/EmptyState';
import type { CartItem } from './cartSlice';

const CartPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const items = useAppSelector(selectCartItems);
    const totalPrice = useAppSelector(selectCartTotalPrice);

    const handleRemove = (item: CartItem): void => {
        dispatch(removeItem(item.product.id));

        const toastId = toast.info(
            <div className="d-flex align-items-center justify-content-between gap-3 w-100">
                <span className="text-truncate">«{item.product.name}» видалено</span>
                <Button
                    variant="outline-light"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => {
                        dispatch(addItem({ product: item.product, quantity: item.quantity }));
                        toast.dismiss(toastId);
                    }}
                >
                    Скасувати
                </Button>
            </div>,
            { autoClose: 4000, closeOnClick: false }
        );
    };

    if (items.length === 0) {
        return (
            <Container className="py-5">
                <EmptyState
                    title="Кошик порожній"
                    description="Додайте товари з каталогу, щоб оформити замовлення"
                    action={{ label: 'Перейти до каталогу', to: '/' }}
                />
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="fw-bold mb-4">Кошик</h2>
            <Row className="g-4">
                <Col lg={8}>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Товар</th>
                                <th className="text-center">Кількість</th>
                                <th className="text-end">Сума</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                const { product, quantity } = item;
                                return (
                                    <tr key={product.id} className="align-middle">
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <Image
                                                    src={product.imageUrl ?? '/placeholder.svg'}
                                                    alt={product.name}
                                                    style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                                    className="bg-light rounded p-1"
                                                />
                                                <div>
                                                    <Link
                                                        to={`/products/${product.id}`}
                                                        className="text-decoration-none text-dark fw-semibold"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <div className="text-muted small">{formatPrice(product.price)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <div className="d-flex align-items-center justify-content-center gap-1">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity - 1 }))}
                                            >
                                                −
                                            </Button>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm text-center cart-qty-input"
                                                value={quantity}
                                                min={1}
                                                max={product.stockQuantity}
                                                onChange={(e) => {
                                                    const val = Math.max(1, Math.min(product.stockQuantity, Number(e.target.value) || 1));
                                                    dispatch(updateQuantity({ productId: product.id, quantity: val }));
                                                }}
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                disabled={quantity >= product.stockQuantity}
                                                onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity + 1 }))}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <td className="text-end fw-semibold">
                                            {formatPrice(product.price * quantity)}
                                        </td>
                                        <td className="text-end">
                                            <Button
                                                variant="link"
                                                className="text-danger p-0"
                                                onClick={() => handleRemove(item)}
                                                aria-label={`Видалити ${product.name}`}
                                            >
                                                <BsTrash size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Col>

                <Col lg={4}>
                    <div className="border rounded-3 p-4">
                        <h5 className="fw-bold mb-3">Підсумок</h5>
                        <div className="d-flex justify-content-between mb-2 text-muted">
                            <span>Товарів:</span>
                            <span>{items.reduce((s, i) => s + i.quantity, 0)} шт.</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                            <span>Разом:</span>
                            <span className="text-primary">{formatPrice(totalPrice)}</span>
                        </div>
                        <Button
                            variant="primary"
                            className="w-100"
                            size="lg"
                            onClick={() => navigate('/checkout')}
                        >
                            Оформити замовлення
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;