export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderListItem {
    id: number;
    createdAt: string;
    status: OrderStatus;
    totalAmount: number;
    itemCount: number;
}

export interface OrderItemDto {
    productId: number;
    productName: string;
    productImageUrl?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface OrderDetail {
    id: number;
    createdAt: string;
    status: OrderStatus;
    totalAmount: number;
    shippingAddress: string;
    shippingCity: string;
    items: OrderItemDto[];
}

export interface CreateOrderRequest {
    shippingAddress: string;
    shippingCity: string;
    items: { productId: number; quantity: number }[];
}