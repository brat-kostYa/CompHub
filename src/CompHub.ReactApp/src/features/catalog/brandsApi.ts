import { baseApi } from '../../api/baseApi';
import type { ApiResponse } from '../../types/api';
import type { Brand } from '../../types/brand';

export const brandsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBrands: builder.query<Brand[], void>({
            transformResponse: (response: ApiResponse<Brand[]>) => response.data!,
            query: () => '/brands',
        }),
    }),
});

export const { useGetBrandsQuery } = brandsApi;