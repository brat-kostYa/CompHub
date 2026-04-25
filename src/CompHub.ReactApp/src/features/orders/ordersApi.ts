import { baseApi } from '../../api/baseApi';
import type { ApiResponse } from '../../types/api';
import type { CreateOrderRequest, OrderDetail, OrderListItem } from '../../types/order';

export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyOrders: builder.query<OrderListItem[], void>({
            transformResponse: (response: ApiResponse<OrderListItem[]>) => response.data!,
            query: () => '/orders',
            providesTags: ['Order'],
        }),
        getOrderById: builder.query<OrderDetail, number>({
            transformResponse: (response: ApiResponse<OrderDetail>) => response.data!,
            query: (id) => `/orders/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Order', id }],
        }),
        createOrder: builder.mutation<OrderDetail, CreateOrderRequest>({
            transformResponse: (response: ApiResponse<OrderDetail>) => response.data!,
            query: (body) => ({ url: '/orders', method: 'POST', body }),
            invalidatesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation<OrderDetail, { id: number; status: string }>({
            transformResponse: (response: ApiResponse<OrderDetail>) => response.data!,
            query: ({ id, status }) => ({
                url: `/orders/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Order'],
        }),
    }),
});

export const {
    useGetMyOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useUpdateOrderStatusMutation,
} = ordersApi;