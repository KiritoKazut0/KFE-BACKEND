export class UserAlreadyDeletedError extends Error {
    constructor(id: string) {
        super(`User with ID ${id} is already deleted`);
        this.name = 'UserAlreadyDeletedError';
    }
}