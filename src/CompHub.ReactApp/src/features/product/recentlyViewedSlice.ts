import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductListItem } from '../../types/product';
import type { RootState } from '../../store';

const MAX_ITEMS = 8;

interface RecentlyViewedState {
    items: ProductListItem[];
}

const loadFromStorage = (): ProductListItem[] => {
    try {
        const raw = localStorage.getItem('recentlyViewed');
        return raw ? (JSON.parse(raw) as ProductListItem[]) : [];
    } catch {
        return [];
    }
};

const recentlyViewedSlice = createSlice({
    name: 'recentlyViewed',
    initialState: { items: loadFromStorage() } as RecentlyViewedState,
    reducers: {
        addRecentlyViewed(state, action: PayloadAction<ProductListItem>) {
            state.items = [
                action.payload,
                ...state.items.filter((i) => i.id !== action.payload.id),
            ].slice(0, MAX_ITEMS);
            localStorage.setItem('recentlyViewed', JSON.stringify(state.items));
        },
    },
});

export const { addRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;

export const selectRecentlyViewed = (state: RootState): ProductListItem[] =>
    state.recentlyViewed.items;