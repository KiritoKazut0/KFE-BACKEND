import { Category } from "../domain/category";
import { CategoryRepository } from "../domain/categoryRepository";

export class ListCategoriesUseCase {
    constructor(
        private readonly categoryRepository: CategoryRepository
    ) {}

    async run(): Promise<Category[]> {
        return await this.categoryRepository.findAll();
    }
}