import * as crypto from "node:crypto";
import { Order, OrderDetail, PaymentMethod } from "../domain/order";
import { OrderRepository } from "../domain/orderRepository";
import { ProductRepository } from "../../products/domain/productRepository";
import { ProductNotFoundError } from "../../products/domain/errors/productNotFoundError";
import { Product } from "../../products/domain/product";
import { EmptyOrderError } from "../domain/errors/emptyOrderError";
import { InsufficientStockError } from "../domain/errors/insufficientStockError";


export interface CreateOrderInput {
    userId: string;
    methodPayment: PaymentMethod;
    items: { productId: string; quantity: number; }[];
}

export class CreateOrderUseCase {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly productRepository: ProductRepository
    ) {}

    async run(input: CreateOrderInput): Promise<Order> {
        
        if (!input.items || input.items.length === 0) {
            throw new EmptyOrderError();
        }

        const orderId = crypto.randomUUID();
        const now = new Date();
        const details: OrderDetail[] = [];
        const productsToUpdate: Product[] = [];

        for (const item of input.items) {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new ProductNotFoundError(item.productId);
            }

            if (product.typeProduct === 'STANDARD') {
                if (product.stock === null || product.stock < item.quantity) {
                    throw new InsufficientStockError(product.name);
                }
                product.stock -= item.quantity;
                productsToUpdate.push(product);
            }

            const detailId = crypto.randomUUID();
            const detail = new OrderDetail(
                detailId, orderId, product.id, item.quantity, product.price, 0
            );
            
            detail.calculateSubtotal();
            details.push(detail);
        }

        const order = new Order(
            orderId, input.userId, 0, input.methodPayment, 'PAID', now, now, details
        );
        order.calculateTotal();

        return await this.orderRepository.createTransactionally(order, productsToUpdate);
    }
}