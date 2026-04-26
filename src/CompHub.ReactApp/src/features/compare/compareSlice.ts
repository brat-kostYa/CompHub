import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductListItem } from '../../types/product';
import type { RootState } from '../../store';

const MAX_COMPARE = 4;

interface CompareState {
    items: ProductListItem[];
}

const load = (): ProductListItem[] => {
    try {
        const raw = localStorage.getItem('compare');
        return raw ? (JSON.parse(raw) as ProductListItem[]) : [];
    } catch {
        return [];
    }
};

const persist = (items: ProductListItem[]): void => {
    localStorage.setItem('compare', JSON.stringify(items));
};

const compareSlice = createSlice({
    name: 'compare',
    initialState: { items: load() } as CompareState,
    reducers: {
        toggleCompare(state, action: PayloadAction<ProductListItem>) {
            const idx = state.items.findIndex((i) => i.id === action.payload.id);
            if (idx !== -1) {
                state.items.splice(idx, 1);
            } else if (state.items.length < MAX_COMPARE) {
                state.items.push(action.payload);
            }
            persist(state.items);
        },
        removeFromCompare(state, action: PayloadAction<number>) {
            state.items = state.items.filter((i) => i.id !== action.payload);
            persist(state.items);
        },
        clearCompare(state) {
            state.items = [];
            localStorage.removeItem('compare');
        },
    },
});

export const { toggleCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;

export const selectCompareItems = (state: RootState): ProductListItem[] => state.compare.items;
export const selectIsInCompare = (id: number) => (state: RootState): boolean =>
    state.compare.items.some((i) => i.id === id);
export const selectCompareCount = (state: RootState): number => state.compare.items.length;