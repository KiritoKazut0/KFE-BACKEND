
export class ProductAlreadyExistsError extends Error {
    constructor(name: string) {
        super(`El producto con el nombre '${name}' ya existe en el catálogo.`);
        this.name = "ProductAlreadyExistsError";
    }
}