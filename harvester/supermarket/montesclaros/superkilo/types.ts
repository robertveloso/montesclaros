export interface Product {
    externalId: string;
    description: string;
    image: string;
    price: number;
    category: string;
    branchId: string;
}

export interface SyncLog {
    status: string;
    productsCount: number;
    category: string;
    branchId: string;
}
