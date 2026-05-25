
import { Category } from "./category";

export interface CategoryRepository {
    create(category: Category): Promise<Category>; 
    findByName(name: string): Promise<Category | null>;
    findAll(): Promise<Category[]>;
}