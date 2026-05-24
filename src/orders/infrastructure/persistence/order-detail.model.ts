import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderModel } from './order.model';
import { ProductModel } from '../../../products/infrastructure/persistence/product.model';

@Entity('details_order')
export class OrderDetailModel {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'order_id', type: 'uuid' })
    orderId!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Column('int')
    quantity!: number;

    @Column('decimal', { precision: 10, scale: 2, name: 'unit_price' })
    unitPrice!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal!: number;


    @ManyToOne(() => OrderModel, (order) => order.items)
    @JoinColumn({ name: 'order_id' })
    order!: OrderModel;

    @ManyToOne(() => ProductModel)
    @JoinColumn({ name: 'product_id' })
    product!: ProductModel;
}