import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { BsCheckCircleFill } from 'react-icons/bs';

const OrderSuccessPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <Container className="py-5 text-center">
            <BsCheckCircleFill size={64} className="text-success mb-4" />
            <h2 className="fw-bold mb-2">Замовлення оформлено!</h2>
            <p className="text-muted mb-4">
                Дякуємо за покупку. Ваше замовлення №{id} прийнято в обробку.
            </p>
            <div className="d-flex justify-content-center gap-3">
                <Link to={`/orders/${id}`} className="btn btn-primary">
                    Переглянути замовлення
                </Link>
                <Link to="/" className="btn btn-outline-secondary">
                    Продовжити покупки
                </Link>
            </div>
        </Container>
    );
};

export default OrderSuccessPage;