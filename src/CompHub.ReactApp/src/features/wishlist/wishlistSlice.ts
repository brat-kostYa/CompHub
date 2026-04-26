import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductListItem } from '../../types/product';
import type { RootState } from '../../store';

interface WishlistState {
    items: ProductListItem[];
}

const load = (): ProductListItem[] => {
    try {
        const raw = localStorage.getItem('wishlist');
        return raw ? (JSON.parse(raw) as ProductListItem[]) : [];
    } catch {
        return [];
    }
};

const persist = (items: ProductListItem[]): void => {
    localStorage.setItem('wishlist', JSON.stringify(items));
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: { items: load() } as WishlistState,
    reducers: {
        toggleWishlist(state, action: PayloadAction<ProductListItem>) {
            const idx = state.items.findIndex((i) => i.id === action.payload.id);
            if (idx !== -1) {
                state.items.splice(idx, 1);
            } else {
                state.items.push(action.payload);
            }
            persist(state.items);
        },
        clearWishlist(state) {
            state.items = [];
            localStorage.removeItem('wishlist');
        },
    },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

export const selectWishlistItems = (state: RootState): ProductListItem[] => state.wishlist.items;
export const selectIsInWishlist = (id: number) => (state: RootState): boolean =>
    state.wishlist.items.some((i) => i.id === id);
export const selectWishlistCount = (state: RootState): number => state.wishlist.items.length;