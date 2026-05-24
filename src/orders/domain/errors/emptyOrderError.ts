
export class EmptyOrderError extends Error {
    constructor() { super("La orden no puede estar vacía"); }
}
