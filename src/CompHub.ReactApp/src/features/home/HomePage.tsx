import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    BsArrowRight, BsBoxSeam, BsCpu, BsDisplay,
    BsGrid3X3, BsHddFill, BsLightningChargeFill,
    BsStack, BsThermometerHalf, BsTruck, BsShieldCheck,
    BsArrowCounterclockwise, BsStarFill, BsFire, BsClock,
} from 'react-icons/bs';
import { useGetProductsQuery } from '../catalog/productsApi';
import { useGetCategoriesQuery } from '../catalog/categoriesApi';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectRecentlyViewed } from '../product/recentlyViewedSlice';
import ProductCard from '../catalog/ProductCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import type { ProductFilterParams } from '../../types/product';
import type { JSX } from 'react';

// =============== Category icon map ===============

const CATEGORY_ICONS: Record<string, JSX.Element> = {
    'processors':     <BsCpu size={26} />,
    'graphics-cards': <BsDisplay size={26} />,
    'memory':         <BsStack size={26} />,
    'storage':        <BsHddFill size={26} />,
    'motherboards':   <BsGrid3X3 size={26} />,
    'power-supplies': <BsLightningChargeFill size={26} />,
    'cases':          <BsBoxSeam size={26} />,
    'cooling':        <BsThermometerHalf size={26} />,
};

// =============== Section header ===============

type AccentColor = 'primary' | 'warning' | 'success' | 'info';

interface SectionHeaderProps {
    icon: JSX.Element;
    title: string;
    linkTo: string;
    accent?: AccentColor;
}

const SectionHeader = ({ icon, title, linkTo, accent = 'primary' }: SectionHeaderProps) => (
    <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
            <div className={`section-icon-box section-icon-${accent}`}>{icon}</div>
            <h4 className="fw-bold mb-0">{title}</h4>
        </div>
        <Link to={linkTo} className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1">
            Всі <BsArrowRight size={13} />
        </Link>
    </div>
);

// =============== Product section ===============

interface ProductSectionProps {
    icon: JSX.Element;
    title: string;
    linkTo: string;
    filter: ProductFilterParams;
    accent?: AccentColor;
    count?: number;
}

const ProductSection = ({ icon, title, linkTo, filter, accent, count = 4 }: ProductSectionProps) => {
    const { data: paged, isLoading } = useGetProductsQuery({ ...filter, pageSize: count });

    return (
        <section className="mb-5">
            <SectionHeader icon={icon} title={title} linkTo={linkTo} accent={accent} />
            <Row xs={1} sm={2} lg={4} className="g-3">
                {isLoading
                    ? Array.from({ length: count }).map((_, i) => (
                        <Col key={i}><SkeletonCard /></Col>
                    ))
                    : paged?.items.slice(0, count).map((p) => (
                        <Col key={p.id}><ProductCard product={p} /></Col>
                    ))
                }
            </Row>
        </section>
    );
};

// =============== Page ===============

const HomePage = () => {
    const { data: categories = [] } = useGetCategoriesQuery();
    const recentlyViewed = useAppSelector(selectRecentlyViewed);
    const topLevelCats = categories.filter((c) => !c.parentCategoryId);

    return (
        <>
            {/* Hero */}
            <section className="hero-banner">
                <Container>
                    <Row className="align-items-center g-5">
                        <Col lg={6}>
                            <div className="hero-badge mb-3">
                                <BsFire size={13} className="me-1" />
                                Актуальні пропозиції
                            </div>
                            <h1 className="hero-title mb-3">
                                Збери ПК мрії<br />
                                <span className="hero-title-accent">з CompHub</span>
                            </h1>
                            <p className="hero-subtitle mb-4">
                                Процесори, відеокарти, пам'ять та накопичувачі —
                                все для вашого ідеального збирання з гарантією якості та швидкою доставкою.
                            </p>
                            <div className="hero-features mb-5">
                                <div className="hero-feature">
                                    <BsTruck size={14} /> Доставка по Україні
                                </div>
                                <div className="hero-feature">
                                    <BsShieldCheck size={14} /> Офіційна гарантія
                                </div>
                                <div className="hero-feature">
                                    <BsArrowCounterclockwise size={14} /> Повернення 14 днів
                                </div>
                            </div>
                            <div className="d-flex gap-3 flex-wrap">
                                <Link to="/catalog" className="btn btn-primary btn-lg px-5 d-inline-flex align-items-center gap-2">
                                    До каталогу <BsArrowRight size={16} />
                                </Link>
                                <Link to="/catalog?sortBy=newest" className="btn btn-outline-light btn-lg px-4">
                                    Новинки
                                </Link>
                            </div>
                        </Col>

                        <Col lg={6} className="d-none d-lg-block">
                            <div className="hero-categories-grid">
                                {topLevelCats.slice(0, 4).map((cat) => (
                                    <Link
                                        key={cat.id}
                                        to={`/catalog?categoryId=${cat.id}`}
                                        className="hero-cat-card text-decoration-none"
                                    >
                                        <div className="hero-cat-icon">
                                            {cat.slug ? CATEGORY_ICONS[cat.slug] ?? <BsCpu size={26} /> : <BsCpu size={26} />}
                                        </div>
                                        <span className="hero-cat-name">{cat.name}</span>
                                        <BsArrowRight size={13} className="hero-cat-arrow ms-auto" />
                                    </Link>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="py-5">
                {/* Categories */}
                <section className="mb-5">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="section-icon-box section-icon-primary">
                            <BsGrid3X3 size={18} />
                        </div>
                        <h4 className="fw-bold mb-0">Категорії</h4>
                    </div>
                    <Row xs={2} sm={4} lg={8} className="g-3">
                        {topLevelCats.map((cat) => (
                            <Col key={cat.id} className="col-6 col-sm-3 col-lg-auto flex-lg-fill" style={{ minWidth: 0 }}>
                                <Link to={`/catalog?categoryId=${cat.id}`} className="text-decoration-none">
                                    <div className="home-category-card text-center p-3 rounded-3 h-100">
                                        <div className="home-category-icon mb-2 text-primary">
                                            {cat.slug ? CATEGORY_ICONS[cat.slug] ?? <BsCpu size={28} /> : <BsCpu size={28} />}
                                        </div>
                                        <div className="fw-semibold small text-dark">{cat.name}</div>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </section>

                <ProductSection
                    icon={<BsClock size={18} />}
                    title="Нові надходження"
                    linkTo="/catalog?sortBy=newest"
                    filter={{ sortBy: 'newest' }}
                    accent="primary"
                />

                <ProductSection
                    icon={<BsCpu size={18} />}
                    title="Процесори"
                    linkTo="/catalog?categoryId=1"
                    filter={{ categoryId: 1, sortBy: 'newest' }}
                    accent="info"
                />

                <ProductSection
                    icon={<BsDisplay size={18} />}
                    title="Відеокарти"
                    linkTo="/catalog?categoryId=2"
                    filter={{ categoryId: 2, sortBy: 'newest' }}
                    accent="success"
                />

                <ProductSection
                    icon={<BsStarFill size={16} />}
                    title="Найкращі пропозиції"
                    linkTo="/catalog?sortBy=price_asc"
                    filter={{ sortBy: 'price_asc', inStock: true }}
                    accent="warning"
                />

                {recentlyViewed.length > 0 && (
                    <section className="mb-5">
                        <SectionHeader
                            icon={<BsClock size={18} />}
                            title="Нещодавно переглянуті"
                            linkTo="/catalog"
                            accent="primary"
                        />
                        <Row xs={1} sm={2} lg={4} className="g-3">
                            {recentlyViewed.slice(0, 4).map((p) => (
                                <Col key={p.id}><ProductCard product={p} /></Col>
                            ))}
                        </Row>
                    </section>
                )}
            </Container>
        </>
    );
};

export default HomePage;