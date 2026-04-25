import { useEffect } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation } from './authApi';
import { setCredentials, selectIsAuthenticated } from './authSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import type { LoginRequest } from '../../types/auth';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

    const [login, { isLoading, error }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>();

    useEffect(() => {
        if (isAuthenticated) navigate(from, { replace: true });
    }, [isAuthenticated, navigate, from]);

    const onSubmit = async (data: LoginRequest): Promise<void> => {
        const result = await login(data).unwrap();
        dispatch(setCredentials(result));
        toast.success('Ласкаво просимо!');
        navigate(from, { replace: true });
    };

    const apiError =
        error && 'data' in error
            ? (error.data as { message?: string })?.message
            : undefined;

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={7} lg={5}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4 p-md-5">
                            <h2 className="mb-4 fw-bold text-center">Вхід в акаунт</h2>

                            {apiError && <Alert variant="danger">{apiError}</Alert>}

                            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="you@example.com"
                                        isInvalid={!!errors.email}
                                        {...register('email', {
                                            required: "Email є обов'язковим",
                                            pattern: { value: /^\S+@\S+$/, message: 'Невірний формат email' },
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="••••••••"
                                        isInvalid={!!errors.password}
                                        {...register('password', { required: "Пароль є обов'язковим" })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button type="submit" variant="primary" className="w-100" disabled={isLoading}>
                                    {isLoading ? <Spinner size="sm" animation="border" /> : 'Увійти'}
                                </Button>
                            </Form>

                            <p className="text-center mt-3 mb-0 text-muted">
                                Немає акаунту?{' '}
                                <Link to="/register" className="fw-semibold text-decoration-none">
                                    Зареєструватися
                                </Link>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;