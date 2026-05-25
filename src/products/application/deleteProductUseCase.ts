
import { ProductRepository } from "../domain/productRepository";
import { ProductNotFoundError } from "../domain/errors/productNotFoundError";

export class DeleteProductUseCase {
    constructor(
        private readonly productRepository: ProductRepository
    ) {}

    async run(id: string): Promise<void> {
        const product = await this.productRepository.findById(id);

        if (!product) {
            throw new ProductNotFoundError(id);
        }

        if (product.deletedAt !== null) {
            return; 
        }

        const now = new Date();
        product.isActive = false;
        product.deletedAt = now;
        product.updatedAt = now;
        await this.productRepository.update(product);
    }
}