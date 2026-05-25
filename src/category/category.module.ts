import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryModel } from "./infrastructure/persistence/category.model"; 
import { SecurityModule } from "../core/security/security.module";
import { CategoriesController } from "./infrastructure/controllers/category.controller";
import { MysqlCategoryRepository } from "./infrastructure/persistence/mysql-category.repository";
import { CreateCategoryUseCase } from "./application/createCategoryUseCase";
import { ListCategoriesUseCase } from "./application/listCategoriesUseCase";

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryModel]),
        SecurityModule
    ],

    controllers: [CategoriesController],
    providers: [
        MysqlCategoryRepository,
        {
            provide: CreateCategoryUseCase,
            useFactory: (categoryRepository: MysqlCategoryRepository) => {
                return new CreateCategoryUseCase(categoryRepository)
            },
            inject: [MysqlCategoryRepository]
        },
        {
            provide: ListCategoriesUseCase,
            useFactory: (categoryRepository: MysqlCategoryRepository) => {
                return new ListCategoriesUseCase(categoryRepository)
            },
            inject: [MysqlCategoryRepository]
        }
    ],

    exports: [MysqlCategoryRepository]

})
export class CategoryModule {}