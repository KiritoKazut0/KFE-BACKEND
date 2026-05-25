import { Product } from "../domain/product";
import { ProductRepository, PaginatedResult } from "../domain/productRepository";

export class GetProductsByCategoryUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    async run(categoryId: string, page: number, limit: number): Promise<PaginatedResult<Product>> {
        return await this.productRepository.findByCategory(categoryId, page, limit);
    }
}