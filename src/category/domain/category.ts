
export class Category {
    constructor(
        public readonly id: string,
        public name: string,
        public description: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
        public readonly deletedAt?: Date | null
    ) {}
}