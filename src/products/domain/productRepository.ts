import { Product } from "./product";

export interface PaginatedResult<T> {
    items: T[];
    total: number;
}

export interface ProductRepository {
    create(product: Product): Promise<Product>;
    findById(id: string): Promise<Product | null>;
    findByName(name: string): Promise<Product | null>;
    update(product: Product): Promise<Product>;
    findAll(page: number, limit: number): Promise<PaginatedResult<Product>>;
    findByCategory(categoryId: string, page: number, limit: number): Promise<PaginatedResult<Product>>; 
}