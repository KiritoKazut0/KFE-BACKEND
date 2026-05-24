import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { Product } from "../../domain/product";
import { PaginatedResult, ProductRepository } from "../../domain/productRepository";
import { ProductModel } from "./product.model";

@Injectable()
export class MysqlProductRepository implements ProductRepository {
    constructor(
        @InjectRepository(ProductModel)
        private readonly repository: Repository<ProductModel>
    ) {}

    async create(product: Product): Promise<Product> {
        const productModel = this.toPersistence(product);
        const savedProduct = await this.repository.save(productModel);
        return this.toDomain(savedProduct);
    }

    async findById(id: string): Promise<Product | null> {
        const model = await this.repository.findOne({ 
            where: { id, deletedAt: IsNull() } 
        });
        return model ? this.toDomain(model) : null;
    }

    async findByName(name: string): Promise<Product | null> {
        const model = await this.repository.findOne({ 
            where: { name, deletedAt: IsNull() } 
        });
        return model ? this.toDomain(model) : null;
    }

   async findAll(page: number, limit: number): Promise<PaginatedResult<Product>> {
        const skip = (page - 1) * limit;
        const [models, total] = await this.repository.findAndCount({ 
            where: { deletedAt: IsNull() },
            skip, take: limit
        });
        return { items: models.map(m => this.toDomain(m)), total };
    }

    async findByCategory(categoryId: string, page: number, limit: number): Promise<PaginatedResult<Product>> {
        const skip = (page - 1) * limit;
        const [models, total] = await this.repository.findAndCount({ 
            where: { categoryId, deletedAt: IsNull() },
            skip, take: limit
        });
        return { items: models.map(m => this.toDomain(m)), total };
    }

    async update(product: Product): Promise<Product> {
        const productModel = this.toPersistence(product);
        const updatedProduct = await this.repository.save(productModel);
        return this.toDomain(updatedProduct);
    }



    private toPersistence(product: Product): ProductModel {
        const model = new ProductModel();
        model.id = product.id;
        model.categoryId = product.categoryId;
        model.name = product.name;
        model.typeProduct = product.typeProduct;
        model.price = product.price;
        model.stock = product.stock; 
        model.isActive = product.isActive;
        model.imageUrl = product.imageUrl;
        model.createdAt = product.createdAt;
        model.updatedAt = product.updatedAt;
        model.deletedAt = product.deletedAt;
        return model;
    }

    private toDomain(model: ProductModel): Product {
        return new Product(
            model.id,
            model.categoryId,
            model.name,
            model.typeProduct,
            Number.parseFloat(model.price.toString()), 
            model.stock,
            model.isActive,
            model.imageUrl,
            model.createdAt,
            model.updatedAt,
            model.deletedAt
        );
    }
}