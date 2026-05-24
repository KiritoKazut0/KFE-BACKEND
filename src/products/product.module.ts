import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModel } from './infrastructure/persistence/product.model';
import { MysqlProductRepository } from './infrastructure/persistence/mysql-product.repository';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { CreateProductUseCase } from './application/createProductUseCase';
import { DeleteProductUseCase } from './application/deleteProductUseCase';
import { GetProductsByCategoryUseCase } from './application/getProductsByCategory';
import { ListProductsUseCase } from './application/listProductsUseCase';

import { CloudinaryServiceImpl } from '../shared/infrastructure/service/imageStorageServiceImpl';
import { SecurityModule } from '../core/security/security.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductModel]),
        SecurityModule
    ],
    controllers: [ ProductsController],
    providers: [
        MysqlProductRepository,
        CloudinaryServiceImpl,
        {
            provide: CreateProductUseCase,
            useFactory: (
                productRepository: MysqlProductRepository,
                imageStorageService: CloudinaryServiceImpl
            ) => new CreateProductUseCase(productRepository, imageStorageService),
            inject: [MysqlProductRepository, CloudinaryServiceImpl]
        },
        {
            provide: DeleteProductUseCase,
            useFactory: (productRepository: MysqlProductRepository) => 
                new DeleteProductUseCase(productRepository),
            inject: [MysqlProductRepository]
        },
        {
            provide: GetProductsByCategoryUseCase,
            useFactory: (productRepository: MysqlProductRepository) => 
                new GetProductsByCategoryUseCase(productRepository),
            inject: [MysqlProductRepository]
        },
        {
            provide: ListProductsUseCase,
            useFactory: (productRepository: MysqlProductRepository) => 
                new ListProductsUseCase(productRepository),
            inject: [MysqlProductRepository]
        }
    ],
    exports: [
        MysqlProductRepository
    ]
})
export class ProductsModule {}