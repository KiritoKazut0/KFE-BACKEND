
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';
export type OrderStatus = 'PAID' | 'CANCELED';

export class OrderDetail {
    constructor(
        public readonly id: string,
        public readonly orderId: string,
        public readonly productId: string,
        public quantity: number,
        public unitPrice: number,
        public subtotal: number
    ) {}

    calculateSubtotal(): void {
        this.subtotal = this.quantity * this.unitPrice;
    }
}

export class Order {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public total: number,
        public methodPayment: PaymentMethod,
        public status: OrderStatus,
        public readonly createdAt: Date,
        public updatedAt: Date,
        public items: OrderDetail[] 
    ) {}

    calculateTotal(): void {
        this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    }
}