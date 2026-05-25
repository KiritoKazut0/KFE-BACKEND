import { PaginatedOrderResult, OrderRepository } from "../domain/orderRepository";

export class ListOrdersUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async run(page: number, limit: number): Promise<PaginatedOrderResult> {
        return await this.orderRepository.findAll(page, limit);
    }
}