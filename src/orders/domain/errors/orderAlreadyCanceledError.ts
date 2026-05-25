
export class OrderAlreadyCanceledError extends Error {
    constructor(id: string) { super(`La orden ${id} ya está cancelada`); }
}