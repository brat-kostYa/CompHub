import { Button, Card, Col, Container, Form, ListGroup, Row, Spinner as BsSpinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { extractApiError } from '../../hooks/useApiError';
import { selectCartItems, selectCartTotalPrice, clearCart } from '../cart/cartSlice';
import { useCreateOrderMutation } from '../orders/ordersApi';
import { formatPrice } from '../../lib/utils';
import type { CreateOrderRequest } from '../../types/order';
import { toast } from 'react-toastify';

interface ShippingForm {
    shippingAddress: string;
    shippingCity: string;
}

const CheckoutPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const items = useAppSelector(selectCartItems);
    const totalPrice = useAppSelector(selectCartTotalPrice);

    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ShippingForm>();

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const onSubmit = async (formData: ShippingForm): Promise<void> => {
        const request: CreateOrderRequest = {
            ...formData,
            items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        };

        const result = await createOrder(request);

        if ('error' in result) {
            toast.error(extractApiError(result.error) ?? 'Не вдалося оформити замовлення.');
            return;
        }

        dispatch(clearCart());
        navigate(`/orders/success/${result.data.id}`);
    };

    return (
        <Container>
            <h2 className="fw-bold mb-4">Оформлення замовлення</h2>

            <Row className="g-4">
                <Col lg={7}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4">Адреса доставки</h5>
                            <Form id="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                                <Form.Group className="mb-3">
                                    <Form.Label>Місто</Form.Label>
                                    <Form.Control
                                        placeholder="Київ"
                                        isInvalid={!!errors.shippingCity}
                                        {...register('shippingCity', { required: "Обов'язкове поле" })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.shippingCity?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Адреса</Form.Label>
                                    <Form.Control
                                        placeholder="вул. Хрещатик, 1"
                                        isInvalid={!!errors.shippingAddress}
                                        {...register('shippingAddress', { required: "Обов'язкове поле" })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.shippingAddress?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-3">Ваше замовлення</h5>
                            <ListGroup variant="flush" className="mb-3">
                                {items.map(({ product, quantity }) => (
                                    <ListGroup.Item key={product.id} className="px-0 d-flex justify-content-between">
                                        <span className="text-muted">
                                            {product.name} × {quantity}
                                        </span>
                                        <span className="fw-semibold">
                                            {formatPrice(product.price * quantity)}
                                        </span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                                <span>Разом:</span>
                                <span className="text-primary">{formatPrice(totalPrice)}</span>
                            </div>
                            <Button
                                form="checkout-form"
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-100"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? <><BsSpinner size="sm" animation="border" className="me-2" />Оформлення...</>
                                    : 'Підтвердити замовлення'
                                }
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;