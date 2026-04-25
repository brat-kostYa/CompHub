import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import {
    BsTelephone, BsEnvelope, BsGeoAlt,
    BsFacebook, BsInstagram, BsTelegram, BsTwitter,
} from 'react-icons/bs';

const AppFooter = () => (
    <footer className="app-footer">
        <Container>
            <Row className="g-4 py-5">
                {/* Brand */}
                <Col lg={4} md={6}>
                    <Image
                        src="/CompHub-logo.svg"
                        style={{ width: '150px', height: '68px', objectFit: 'contain', marginBottom: '1rem' }}
                    />
                    <p className="footer-desc">
                        Інтернет-магазин комп'ютерної техніки. Процесори, відеокарти, пам'ять, накопичувачі — все для вашого ідеального збирання з гарантією якості.
                    </p>
                    <div className="d-flex gap-2 mt-3">
                        <a href="#" className="footer-social" aria-label="Facebook"><BsFacebook size={17} /></a>
                        <a href="#" className="footer-social" aria-label="Instagram"><BsInstagram size={17} /></a>
                        <a href="#" className="footer-social" aria-label="Telegram"><BsTelegram size={17} /></a>
                        <a href="#" className="footer-social" aria-label="Twitter"><BsTwitter size={17} /></a>
                    </div>
                </Col>

                {/* Catalog links */}
                <Col lg={2} md={6} sm={6} xs={6}>
                    <h6 className="footer-heading">Каталог</h6>
                    <ul className="footer-links">
                        <li><Link to="/catalog?categoryId=1">Процесори</Link></li>
                        <li><Link to="/catalog?categoryId=2">Відеокарти</Link></li>
                        <li><Link to="/catalog?categoryId=3">Оперативна пам'ять</Link></li>
                        <li><Link to="/catalog?categoryId=5">Материнські плати</Link></li>
                        <li><Link to="/catalog?categoryId=9">SSD-накопичувачі</Link></li>
                        <li><Link to="/catalog?categoryId=6">Блоки живлення</Link></li>
                        <li><Link to="/catalog">Весь каталог →</Link></li>
                    </ul>
                </Col>

                {/* Customer links */}
                <Col lg={3} md={6} sm={6} xs={6}>
                    <h6 className="footer-heading">Покупцям</h6>
                    <ul className="footer-links">
                        <li><Link to="#">Доставка і оплата</Link></li>
                        <li><Link to="#">Гарантія та сервіс</Link></li>
                        <li><Link to="#">Обмін та повернення</Link></li>
                        <li><Link to="#">Про нас</Link></li>
                        <li><Link to="#">Контакти</Link></li>
                    </ul>
                </Col>

                {/* Contacts */}
                <Col lg={3} md={6}>
                    <h6 className="footer-heading">Контакти</h6>
                    <ul className="footer-contacts">
                        <li>
                            <BsTelephone size={14} className="text-primary flex-shrink-0 mt-1" />
                            <a href="tel:+380501234567">+380 50 123 45 67</a>
                        </li>
                        <li>
                            <BsEnvelope size={14} className="text-primary flex-shrink-0 mt-1" />
                            <a href="mailto:info@comphub.ua">info@comphub.ua</a>
                        </li>
                        <li>
                            <BsGeoAlt size={14} className="text-primary flex-shrink-0 mt-1" />
                            <span>м. Київ, вул. Хрещатик, 1</span>
                        </li>
                    </ul>
                    <div className="footer-hours mt-3">
                        <div className="footer-hours-label">Час роботи:</div>
                        <div>Пн–Пт: 09:00 – 20:00</div>
                        <div>Сб–Нд: 10:00 – 18:00</div>
                    </div>
                </Col>
            </Row>
        </Container>

        <div className="footer-bottom">
            <Container>
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                    <small className="text-secondary">© {new Date().getFullYear()} CompHub — всі права захищені</small>
                    <div className="footer-payment">
                        <span className="footer-payment-badge">VISA</span>
                        <span className="footer-payment-badge">Mastercard</span>
                        <span className="footer-payment-badge">Нова Пошта</span>
                        <span className="footer-payment-badge">Укрпошта</span>
                    </div>
                </div>
            </Container>
        </div>
    </footer>
);

export default AppFooter;