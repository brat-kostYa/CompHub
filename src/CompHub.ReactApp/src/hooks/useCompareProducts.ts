import { useGetProductByIdQuery } from '../features/catalog/productsApi';
import type { ProductDetail } from '../types/product';

// Safe: called with a fixed-length array based on MAX_COMPARE=4
// Each slot is always rendered; missing slots use `skip`
const SLOTS = [0, 1, 2, 3] as const;

export const useCompareProducts = (ids: number[]): (ProductDetail | undefined)[] => {
    const r0 = useGetProductByIdQuery(ids[0], { skip: ids.length < 1 });
    const r1 = useGetProductByIdQuery(ids[1], { skip: ids.length < 2 });
    const r2 = useGetProductByIdQuery(ids[2], { skip: ids.length < 3 });
    const r3 = useGetProductByIdQuery(ids[3], { skip: ids.length < 4 });

    return [r0.data, r1.data, r2.data, r3.data].slice(0, ids.length);
};