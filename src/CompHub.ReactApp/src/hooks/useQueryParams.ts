import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

type ParamValue = string | number | boolean | undefined | null;

export function useQueryParams(): {
    searchParams: URLSearchParams;
    setParams: (updates: Record<string, ParamValue>) => void;
} {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const setParams = useCallback(
        (updates: Record<string, ParamValue>) => {
            const next = new URLSearchParams(searchParams);
            Object.entries(updates).forEach(([key, value]) => {
                if (value == null || value === '') {
                    next.delete(key);
                } else {
                    next.set(key, String(value));
                }
            });
            navigate({ search: next.toString() }, { replace: true });
        },
        [searchParams, navigate]
    );

    return { searchParams, setParams };
}