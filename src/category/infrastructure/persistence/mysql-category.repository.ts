import { InjectRepository } from "@nestjs/typeorm";
import { CategoryRepository } from "../../domain/categoryRepository";
import { CategoryModel } from "./category.model";
import { IsNull, Repository } from "typeorm";
import { Category } from "../../domain/category";


export class MysqlCategoryRepository implements CategoryRepository {
    constructor(
        @InjectRepository(CategoryModel)
        private readonly typeOrmRepository: Repository<CategoryModel>
    ){}

   async create(category: Category): Promise<Category> {
        const categoryModel = this.typeOrmRepository.create({
            id: category.id,
            name: category.name,
            description: category.description,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            deletedAt: category.deletedAt
        });

        const savedCategory = await this.typeOrmRepository.save(categoryModel);
        
        return this.toDomain(savedCategory);
    }

   async findAll(): Promise<Category[]> {
        const categories = await this.typeOrmRepository.find({
            where: {deletedAt: IsNull()}
        });
        return categories.map(category => this.toDomain(category));
    }

   async findByName(name: string): Promise<Category | null> {
     const categoryModel = await this.typeOrmRepository.findOne({ where: { name } });
        if (!categoryModel) return null;
        return this.toDomain(categoryModel);   
    }

    private toDomain(model: CategoryModel): Category {
        return new Category(
            model.id,
            model.name,
            model.description,
            model.createdAt,
            model.updatedAt,
            model.deletedAt
        );
    }

}