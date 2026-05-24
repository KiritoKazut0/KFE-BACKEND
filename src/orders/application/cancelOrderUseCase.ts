import { Order } from "../domain/order";
import { OrderRepository } from "../domain/orderRepository";
import { ProductRepository } from "../../products/domain/productRepository";
import { Product } from "../../products/domain/product";
import { OrderAlreadyCanceledError } from "../domain/errors/orderAlreadyCanceledError";
import { OrderNotFoundError } from "../domain/errors/orderNotFoundError";



export class CancelOrderUseCase {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly productRepository: ProductRepository
    ) { }

    async run(orderId: string): Promise<Order> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new OrderNotFoundError(orderId);
        }
        if (order.status === 'CANCELED') {
            throw new OrderAlreadyCanceledError(orderId);
        }

        const productsToUpdate: Product[] = [];

        for (const item of order.items) {
            const product = await this.productRepository.findById(item.productId);
            if (product?.typeProduct === 'STANDARD' && product.stock !== null) {
                product.stock += item.quantity;
                productsToUpdate.push(product);
            }
        }

        return await this.orderRepository.cancelTransactionally(orderId, productsToUpdate);
    }
}