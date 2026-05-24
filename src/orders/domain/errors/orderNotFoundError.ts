
export class OrderNotFoundError extends Error {
    constructor(id: string) { super(`No se encontró la orden ${id}`); }
}