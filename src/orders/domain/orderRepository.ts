import { Order } from "./order";
import { Product } from "../../products/domain/product";

export interface PaginatedOrderResult {
    items: Order[];
    total: number;
}

export interface ProductSalesMetric {
    productId: string;
    productName: string;
    quantitySold: number;
    totalRevenue: number;
}

export interface OrderRepository {
    createTransactionally(order: Order, updatedProducts: Product[]): Promise<Order>;
    cancelTransactionally(id: string, updatedProducts: Product[]): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findAll(page: number, limit: number): Promise<PaginatedOrderResult>;
    getSalesMetrics(startDate?: Date, endDate?: Date, limit?: number): Promise<ProductSalesMetric[]>;
}