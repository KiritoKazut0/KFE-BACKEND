
export class InsufficientStockError extends Error {
    constructor(name: string) { super(`Stock insuficiente para el producto: ${name}`); }
}