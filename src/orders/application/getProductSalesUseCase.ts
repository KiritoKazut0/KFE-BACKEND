import { OrderRepository, ProductSalesMetric } from "../domain/orderRepository";

export interface GetProductSalesInput {
    startDate?: Date;
    endDate?: Date;
    limit?: number; 
}

export interface ProductSalesReport {
    period: {
        from: Date | null;
        to: Date | null;
    };
    data: ProductSalesMetric[];
}

export class GetProductSalesUseCase {

    constructor(private readonly orderRepository: OrderRepository) {}

    async run(input: GetProductSalesInput): Promise<ProductSalesReport> {
        const data = await this.orderRepository.getSalesMetrics(
            input.startDate, 
            input.endDate, 
            input.limit
        );

        return {
            period: {
                from: input.startDate ?? null,
                to: input.endDate ?? null
            },
            data
        };
    }
}