import { baseApi } from '../../api/baseApi';
import type { ApiResponse } from '../../types/api';
import type { AuthToken, LoginRequest, RegisterRequest } from '../../types/auth';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthToken, LoginRequest>({
            transformResponse: (response: ApiResponse<AuthToken>) => response.data!,
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
        }),
        register: builder.mutation<AuthToken, RegisterRequest>({
            transformResponse: (response: ApiResponse<AuthToken>) => response.data!,
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;