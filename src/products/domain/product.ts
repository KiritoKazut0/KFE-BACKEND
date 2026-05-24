
export type ProductType = 'STANDARD' | 'PREPARED' | 'KIT';

export class Product {
    constructor(
        public readonly id: string,
        public categoryId: string, 
        public name: string,
        public typeProduct: ProductType,
        public price: number,
        public stock: number | null,
        public isActive: boolean, 
        public imageUrl: string,
        public readonly createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date | null
    ) {}
}