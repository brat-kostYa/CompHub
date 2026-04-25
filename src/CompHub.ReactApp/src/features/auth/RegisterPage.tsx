import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRegisterMutation } from './authApi';
import { setCredentials } from './authSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import type { RegisterRequest } from '../../types/auth';

type FormData = RegisterRequest & { confirmPassword: string };

const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [registerUser, { isLoading, error }] = useRegisterMutation();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async ({ confirmPassword: _, ...data }: FormData): Promise<void> => {
        const result = await registerUser(data).unwrap();
        dispatch(setCredentials(result));
        toast.success('Акаунт створено!');
        navigate('/', { replace: true });
    };

    const apiError =
        error && 'data' in error
            ? (error.data as { message?: string })?.message
            : undefined;

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4 p-md-5">
                            <h2 className="mb-4 fw-bold text-center">Реєстрація</h2>

                            {apiError && <Alert variant="danger">{apiError}</Alert>}

                            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                                <Row className="g-3">
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label>Ім'я</Form.Label>
                                            <Form.Control
                                                isInvalid={!!errors.firstName}
                                                {...register('firstName', { required: "Обов'язкове поле" })}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.firstName?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label>Прізвище</Form.Label>
                                            <Form.Control
                                                isInvalid={!!errors.lastName}
                                                {...register('lastName', { required: "Обов'язкове поле" })}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lastName?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                isInvalid={!!errors.email}
                                                {...register('email', {
                                                    required: "Обов'язкове поле",
                                                    pattern: { value: /^\S+@\S+$/, message: 'Невірний email' },
                                                })}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label>Телефон (необов'язково)</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                placeholder="+380671234567"
                                                {...register('phoneNumber')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label>Пароль</Form.Label>
                                            <Form.Control
                                                type="password"
                                                isInvalid={!!errors.password}
                                                {...register('password', {
                                                    required: "Обов'язкове поле",
                                                    minLength: { value: 6, message: 'Мінімум 6 символів' },
                                                })}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label>Підтвердження пароля</Form.Label>
                                            <Form.Control
                                                type="password"
                                                isInvalid={!!errors.confirmPassword}
                                                {...register('confirmPassword', {
                                                    required: "Обов'язкове поле",
                                                    validate: (val) =>
                                                        val === watch('password') || 'Паролі не співпадають',
                                                })}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button type="submit" variant="primary" className="w-100 mt-4" disabled={isLoading}>
                                    {isLoading ? <Spinner size="sm" animation="border" /> : 'Зареєструватися'}
                                </Button>
                            </Form>

                            <p className="text-center mt-3 mb-0 text-muted">
                                Вже є акаунт?{' '}
                                <Link to="/login" className="fw-semibold text-decoration-none">
                                    Увійти
                                </Link>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;