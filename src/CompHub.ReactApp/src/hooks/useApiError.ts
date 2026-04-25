import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

type RtkError = FetchBaseQueryError | SerializedError | undefined;

/**
 * Extracts a human-readable error message from an RTK Query error.
 * Handles both FetchBaseQueryError (API responses) and SerializedError (network/JS).
 */
export const extractApiError = (error: RtkError): string | undefined => {
    if (!error) return undefined;

    if ('data' in error) {
        const data = error.data as { message?: string } | undefined;
        return data?.message ?? 'Сервер повернув помилку без деталей.';
    }

    if ('message' in error && error.message) return error.message;

    return 'Сталася невідома помилка. Спробуйте пізніше.';
};