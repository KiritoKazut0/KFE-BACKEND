
export class InvalidProductStockError extends Error {
    constructor() {
        super("Los productos estándar requieren especificar un stock inicial válido.");
        this.name = "InvalidProductStockError";
    }
}