export interface ProductListItem {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    categoryName: string;
    brandName: string;
    averageRating?: number | null;
    reviewCount: number;
}

export interface Specification {
    key: string;
    unit?: string;
    value: string;
    displayOrder: number;
}

export interface ProductDetail extends ProductListItem {
    description?: string;
    isActive: boolean;
    createdAt: string;
    categoryId: number;
    brandId: number;
    brandLogoUrl?: string;
    specifications: Specification[];
}

export interface ProductFilterParams {
    categoryId?: number;
    brandIds?: number[];
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
    inStock?: boolean;
    // Key = specificationKeyId, Value = list of selected values
    // Serialized as: specifications[1]=LGA1700&specifications[1]=AM5
    specifications?: Record<number, string[]>;
    sortBy?: 'price_asc' | 'price_desc' | 'name' | 'newest';
    page?: number;
    pageSize?: number;
}

export interface CreateProductRequest {
    name: string;
    description?: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    categoryId: number;
    brandId: number;
    specifications: { specificationKeyId: number; value: string }[];
}

export interface UpdateProductRequest extends CreateProductRequest {
    isActive: boolean;
}