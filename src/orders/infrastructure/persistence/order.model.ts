import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { type PaymentMethod, type OrderStatus } from '../../domain/order';
import { OrderDetailModel } from './order-detail.model';
import { UserModel } from '../../../users/infrastructure/persistence/user.model'; 

@Entity('Orders')
export class OrderModel {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total!: number;

    @Column({ type: 'enum', enum: ['CASH', 'CARD', 'TRANSFER'], name: 'method_payment' })
    methodPayment!: PaymentMethod;

    @Column({ type: 'enum', enum: ['PAID', 'CANCELED'] })
    status!: OrderStatus;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;

    @ManyToOne(() => UserModel)
    @JoinColumn({ name: 'user_id' })
    user!: UserModel;

    @OneToMany(() => OrderDetailModel, (detail) => detail.order, { cascade: true })
    items!: OrderDetailModel[];
}