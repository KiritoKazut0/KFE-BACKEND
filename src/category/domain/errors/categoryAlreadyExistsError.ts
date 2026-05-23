
export class CategoryAlreadyExistsError extends Error {
    constructor(name: string) {
        super(`La categoría '${name}' ya existe en el catálogo.`);
        this.name = "CategoryAlreadyExistsError";
    }
}