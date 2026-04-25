export interface Category {
    id: number;
    name: string;
    slug?: string;
    parentCategoryId?: number;
    subCategories: Category[];
}

export interface SpecificationKey {
    id: number;
    name: string;
    unit?: string;
    displayOrder: number;
}

export interface SpecFilter {
    keyId: number;
    name: string;
    unit?: string;
    displayOrder: number;
    values: string[];
}

export interface CategoryWithSpecKeys {
    id: number;
    name: string;
    slug?: string;
    specificationKeys: SpecificationKey[];
}