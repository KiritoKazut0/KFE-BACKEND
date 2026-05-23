// src/categories/application/createCategory.usecase.ts
import { Category } from "../domain/category";
import { CategoryRepository } from "../domain/categoryRepository";
import { CategoryAlreadyExistsError } from "../domain/errors/categoryAlreadyExistsError";
import * as crypto from "node:crypto";

export class CreateCategoryUseCase {
    constructor(
        private readonly categoryRepository: CategoryRepository
    ) {}

    async run(name: string, description: string): Promise<Category> {
        const existingCategory = await this.categoryRepository.findByName(name);
        
        if (existingCategory) {
            throw new CategoryAlreadyExistsError(name);
        }

        const id = crypto.randomUUID();
        const now = new Date();

        const newCategory = new Category(
            id,
            name,
            description,
            now,
            now,
            null
        );
        
        return await this.categoryRepository.create(newCategory);
    }
}