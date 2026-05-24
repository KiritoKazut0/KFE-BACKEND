
export class ProductNotFoundError extends Error {
    constructor(id: string) {
        super(`El producto con el identificador '${id}' no fue encontrado.`);
        this.name = "ProductNotFoundError";
    }
}