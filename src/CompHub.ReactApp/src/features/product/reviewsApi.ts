import { baseApi } from '../../api/baseApi';
import type { ApiResponse, PagedResult } from '../../types/api';
import type { CreateReviewRequest, Review } from '../../types/review';

export const reviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReviews: builder.query<PagedResult<Review>, { productId: number; page?: number; pageSize?: number }>({
            transformResponse: (response: ApiResponse<PagedResult<Review>>) => response.data!,
            query: ({ productId, page = 1, pageSize = 10 }) => ({
                url: `/products/${productId}/reviews`,
                params: { page, pageSize },
            }),
            providesTags: (_result, _error, { productId }) => [{ type: 'Review', id: productId }],
        }),
        createReview: builder.mutation<Review, { productId: number; body: CreateReviewRequest }>({
            transformResponse: (response: ApiResponse<Review>) => response.data!,
            query: ({ productId, body }) => ({
                url: `/products/${productId}/reviews`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { productId }) => [{ type: 'Review', id: productId }],
        }),
    }),
});

export const { useGetReviewsQuery, useCreateReviewMutation } = reviewsApi;