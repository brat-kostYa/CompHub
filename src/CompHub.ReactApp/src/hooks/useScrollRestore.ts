import { useLayoutEffect } from 'react';
import { useNavigationType } from 'react-router-dom';

/**
 * Saves the current scroll position on unmount and restores it on mount
 * when navigating back (POP navigation). Keyed by a unique route identifier.
 */
const useScrollRestore = (key: string): void => {
    const navType = useNavigationType();
    const storageKey = `scroll:${key}`;

    useLayoutEffect(() => {
        if (navType === 'POP') {
            const saved = sessionStorage.getItem(storageKey);
            if (saved) {
                window.scrollTo({ top: parseInt(saved, 10), behavior: 'instant' });
            }
        }

        return () => {
            sessionStorage.setItem(storageKey, String(window.scrollY));
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useScrollRestore;