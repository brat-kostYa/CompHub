import { useState } from 'react';
import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BsCart3, BsGrid, BsXLg, BsHeart, BsColumnsGap } from 'react-icons/bs';
import { Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useGetCategoriesQuery } from '../../features/catalog/categoriesApi';
import { selectCurrentUser, selectIsAuthenticated, logout } from '../../features/auth/authSlice';
import { selectCartTotalItems } from '../../features/cart/cartSlice';
import GlobalSearch from '../../features/catalog/GlobalSearch';

const AppNavbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const cartCount = useAppSelector(selectCartTotalItems);
    const { data: categories = [] } = useGetCategoriesQuery();
    const [catalogOpen, setCatalogOpen] = useState(false);

    const handleLogout = (): void => {
        dispatch(logout());
        navigate('/');
    };

    const isCatalogActive = pathname.startsWith('/catalog') || pathname.startsWith('/products');

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="app-navbar shadow-sm">
            <Container>
                {/* Logo */}
                <Navbar.Brand as={Link} to="/" className="me-3">
                    <Image src="/CompHub-logo.svg" style={{ width: '140px', height: '52px', objectFit: 'contain' }} />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-nav" />

                <Navbar.Collapse id="main-nav" className="align-items-center">
                    {/* Catalog — next to logo */}
                    <NavDropdown
                        show={catalogOpen}
                        onToggle={setCatalogOpen}
                        title={
                            <span className="catalog-toggle-inner">
                                <span className={`catalog-toggle-icon ${catalogOpen ? 'open' : ''}`}>
                                    {catalogOpen ? <BsXLg size={14} /> : <BsGrid size={14} />}
                                </span>
                                Каталог
                            </span>
                        }
                        id="catalog-nav-dropdown"
                        className={`catalog-nav-dropdown me-3 ${isCatalogActive ? 'is-active' : ''}`}
                    >
                        <NavDropdown.Item as={Link} to="/catalog" className="fw-semibold catalog-all-link"
                            onClick={() => setCatalogOpen(false)}>
                            Весь каталог
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        {categories.map((cat) => (
                            <div key={cat.id}>
                                <NavDropdown.Item as={Link} to={`/catalog?categoryId=${cat.id}`}
                                    onClick={() => setCatalogOpen(false)}>
                                    {cat.name}
                                </NavDropdown.Item>
                                {cat.subCategories.map((sub) => (
                                    <NavDropdown.Item key={sub.id} as={Link}
                                        to={`/catalog?categoryId=${sub.id}`}
                                        className="ps-4 text-muted"
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => setCatalogOpen(false)}>
                                        {sub.name}
                                    </NavDropdown.Item>
                                ))}
                            </div>
                        ))}
                    </NavDropdown>

                    {/* Search — center, flex-grow */}
                    <div className="flex-grow-1 mx-2 my-2 my-lg-0">
                        <GlobalSearch />
                    </div>

                    {/* User utilities — right */}
                    <Nav className="align-items-center gap-1 ms-2">
                        <Nav.Link as={Link} to="/cart" className="nav-icon-btn position-relative" title="Кошик">
                            <BsCart3 size={20} />
                            {cartCount > 0 && (
                                <Badge bg="danger" pill
                                    className="position-absolute top-0 start-100 translate-middle cart-badge">
                                    {cartCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        <Nav.Link className="nav-icon-btn" role="button" title="Бажане"
                            onClick={() => toast.info('Список бажаного — скоро!')}>
                            <BsHeart size={19} />
                        </Nav.Link>

                        <Nav.Link className="nav-icon-btn" role="button" title="Порівняння"
                            onClick={() => toast.info('Порівняння товарів — скоро!')}>
                            <BsColumnsGap size={19} />
                        </Nav.Link>

                        {isAuthenticated && user ? (
                            <NavDropdown
                                title={
                                    <span className="d-inline-flex align-items-center gap-2">
                                        <span className="user-avatar-mini">{user.firstName.charAt(0)}</span>
                                        <span className="d-none d-xl-inline">{user.firstName}</span>
                                    </span>
                                }
                                id="user-nav-dropdown"
                                align="end"
                                className="user-nav-dropdown"
                            >
                                <div className="px-3 py-2 border-bottom">
                                    <div className="fw-semibold small">{user.firstName} {user.lastName}</div>
                                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>{user.email}</div>
                                </div>
                                <NavDropdown.Item as={Link} to="/orders" className="mt-1">
                                    Мої замовлення
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                    Вийти
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="text-white-50 px-3">Увійти</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="btn btn-outline-light btn-sm px-3 ms-1">
                                    Реєстрація
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;