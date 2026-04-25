import { baseApi } from '../../api/baseApi';
import type { ApiResponse } from '../../types/api';
import type { Category, CategoryWithSpecKeys } from '../../types/category';
import type { Brand } from '../../types/brand';

export const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            transformResponse: (response: ApiResponse<Category[]>) => response.data!,
            query: () => '/categories',
        }),
        getCategoryWithSpecKeys: builder.query<CategoryWithSpecKeys, number>({
            transformResponse: (response: ApiResponse<CategoryWithSpecKeys>) => response.data!,
            query: (id) => `/categories/${id}/spec-keys`,
        }),
        getCategoryBrands: builder.query<Brand[], number>({
            transformResponse: (response: ApiResponse<Brand[]>) => response.data!,
            query: (id) => `/categories/${id}/brands`,
        }),
    }),
});

export const { useGetCategoriesQuery, useGetCategoryWithSpecKeysQuery, useGetCategoryBrandsQuery } = categoriesApi;