import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppNavbar from './AppNavbar';
import AppFooter from './AppFooter';
import ScrollToTop from '../common/ScrollToTop';
import BackToTopButton from '../common/BackToTopButton';

const RootLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <ScrollToTop />
            <AppNavbar />
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <AppFooter />
            <BackToTopButton />
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default RootLayout;