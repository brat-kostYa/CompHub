import { baseApi } from '../../api/baseApi';
import type { ApiResponse, PagedResult } from '../../types/api';
import type {
    CreateProductRequest,
    ProductDetail,
    ProductFilterParams,
    ProductListItem,
    UpdateProductRequest,
} from '../../types/product';

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<PagedResult<ProductListItem>, ProductFilterParams>({
            transformResponse: (response: ApiResponse<PagedResult<ProductListItem>>) => response.data!,
            query: (params) => {
                const { brandIds, specifications, ...rest } = params;
                const qs = new URLSearchParams();

                (Object.entries(rest) as [string, unknown][]).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) qs.set(key, String(value));
                });

                brandIds?.forEach((id) => qs.append('brandIds', String(id)));

                if (specifications) {
                    Object.entries(specifications).forEach(([keyId, values]) => {
                        values.forEach((v) => qs.append(`specifications[${keyId}]`, v));
                    });
                }

                return `/products?${qs.toString()}`;
            },
            providesTags: ['Product'],
        }),
        getProductById: builder.query<ProductDetail, number>({
            transformResponse: (response: ApiResponse<ProductDetail>) => response.data!,
            query: (id) => `/products/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Product', id }],
        }),
        createProduct: builder.mutation<ProductDetail, CreateProductRequest>({
            transformResponse: (response: ApiResponse<ProductDetail>) => response.data!,
            query: (body) => ({ url: '/products', method: 'POST', body }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation<ProductDetail, { id: number; body: UpdateProductRequest }>({
            transformResponse: (response: ApiResponse<ProductDetail>) => response.data!,
            query: ({ id, body }) => ({ url: `/products/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Product', id }, 'Product'],
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApi;