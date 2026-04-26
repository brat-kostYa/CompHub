import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import CatalogPage from './features/catalog/CatalogPage';
import HomePage from './features/home/HomePage';
import ProductDetailPage from './features/product/ProductDetailPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import CartPage from './features/cart/CartPage';
import CheckoutPage from './features/checkout/CheckoutPage';
import OrderSuccessPage from './features/checkout/OrderSuccessPage';
import OrdersPage from './features/orders/OrdersPage';
import OrderDetailPage from './features/orders/OrderDetailPage';
import WishlistPage from './features/wishlist/WishlistPage';
import ComparePage from './features/compare/ComparePage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'catalog', element: <CatalogPage /> },
            { path: 'products/:id', element: <ProductDetailPage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'cart', element: <CartPage /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: 'checkout', element: <CheckoutPage /> },
                    { path: 'orders', element: <OrdersPage /> },
                    { path: 'orders/:id', element: <OrderDetailPage /> },
                    { path: 'orders/success/:id', element: <OrderSuccessPage /> },
                ],
            },
            { path: 'wishlist', element: <WishlistPage /> },
            { path: 'compare', element: <ComparePage /> },
            { path: '*', element: <Navigate to="/" replace /> },
        ],
    },
]);