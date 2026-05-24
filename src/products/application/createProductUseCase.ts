import { Product, ProductType } from "../domain/product";
import { ProductRepository } from "../domain/productRepository";
import { ImageStorageService } from "../../shared/application/service/imageStorageService";
import { ProductAlreadyExistsError } from "../domain/errors/productAlreadyExistsError";
import * as crypto from "node:crypto";
import { InvalidProductStockError } from "../domain/errors/InvalidProductStockError";


interface CreateProduct {
    categoryId: string,
    name: string,
    typeProduct: ProductType,
    price: number,
    stock: number | null,
    isActive: boolean,
    imageBuffer: Buffer
}

export class CreateProductUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly imageStorageService: ImageStorageService
    ) { }

    async run(product: CreateProduct): Promise<Product> {

        if (product.typeProduct === 'STANDARD' && product.stock == null) {
            throw new InvalidProductStockError();
        }

        let finalStock = product.stock;
        if (product.typeProduct === 'PREPARED' || product.typeProduct === 'KIT') {
            finalStock = null; 
        }

        const existingProduct = await this.productRepository.findByName(product.name);
        if (existingProduct) {
            throw new ProductAlreadyExistsError(product.name);
        }

        const id = crypto.randomUUID();
        const now = new Date();

        const imageUrl = await this.imageStorageService.uploadImage(
            id,
            product.imageBuffer,
            'products'
        );

        const newProduct = new Product(
            id,
            product.categoryId,
            product.name,
            product.typeProduct,
            product.price,
            finalStock,
            product.isActive,
            imageUrl,
            now,
            now,
            null
        );

        return await this.productRepository.create(newProduct);
    }
}