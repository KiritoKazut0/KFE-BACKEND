import { Product } from "../domain/product";
import { ProductRepository, PaginatedResult } from "../domain/productRepository";

export class ListProductsUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    async run(page: number, limit: number): Promise<PaginatedResult<Product>> {
        return await this.productRepository.findAll(page, limit);
    }
}