import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductListItem } from '../../types/product';
import type { RootState } from '../../store';

export interface CartItem {
    product: ProductListItem;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const stored = localStorage.getItem('cart');
const initialState: CartState = {
    items: stored ? (JSON.parse(stored) as CartItem[]) : [],
};

const persist = (items: CartItem[]): void => {
    localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<{ product: ProductListItem; quantity?: number }>) {
            const { product, quantity = 1 } = action.payload;
            const existing = state.items.find((i) => i.product.id === product.id);
            if (existing) {
                existing.quantity = Math.min(
                    existing.quantity + quantity,
                    product.stockQuantity
                );
            } else {
                state.items.push({ product, quantity });
            }
            persist(state.items);
        },
        removeItem(state, action: PayloadAction<number>) {
            state.items = state.items.filter((i) => i.product.id !== action.payload);
            persist(state.items);
        },
        updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
            const { productId, quantity } = action.payload;
            if (quantity < 1) {
                state.items = state.items.filter((i) => i.product.id !== productId);
            } else {
                const item = state.items.find((i) => i.product.id === productId);
                if (item) item.quantity = quantity;
            }
            persist(state.items);
        },
        clearCart(state) {
            state.items = [];
            localStorage.removeItem('cart');
        },
    },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: RootState): CartItem[] => state.cart.items;
export const selectCartTotalItems = (state: RootState): number =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotalPrice = (state: RootState): number =>
    state.cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);