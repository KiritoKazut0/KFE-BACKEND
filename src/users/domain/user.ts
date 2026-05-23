
export type UserRole = 'MANAGER' | 'CASHIER' | 'ADMIN';

export class User {
    constructor(
        public readonly id: string,
        public name: string,
        public email: string,
        public password: string,
        public role: UserRole,
        public readonly createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date | null
    ) { }

    public changeRole(newRole: UserRole): void {
        this.role = newRole;
        this.updatedAt = new Date();
    }

    public markAsDeleted(): void {
        this.deletedAt = new Date();
        this.updatedAt = new Date();
    }
}

