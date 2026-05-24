// src/orders/infrastructure/persistence/mysql-order.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderDetail } from '../../domain/order';
import { OrderRepository, PaginatedOrderResult, ProductSalesMetric } from '../../domain/orderRepository';
import { OrderModel } from './order.model';
import { OrderDetailModel } from './order-detail.model';
import { Product } from '../../../products/domain/product';
import { ProductModel } from '../../../products/infrastructure/persistence/product.model';

@Injectable()
export class MysqlOrderRepository implements OrderRepository {
    constructor(
        @InjectRepository(OrderModel)
        private readonly repository: Repository<OrderModel>,
        private readonly dataSource: DataSource
    ) {}

    private toDomain(model: OrderModel): Order {
        const items = model.items?.map(item =>
             new OrderDetail(
            item.id, item.orderId, item.productId, item.quantity, Number(item.unitPrice), Number(item.subtotal)
        )) || [];

        return new Order(
            model.id, model.userId, Number(model.total), model.methodPayment, model.status, model.createdAt, model.updatedAt, items
        );
    }

    private toModel(order: Order): OrderModel {
        const model = new OrderModel();
        model.id = order.id;
        model.userId = order.userId; 
        model.total = order.total;
        model.methodPayment = order.methodPayment;
        model.status = order.status;
        
        model.items = order.items.map(item => {
            const detail = new OrderDetailModel();
            detail.id = item.id;
            detail.orderId = item.orderId;
            detail.productId = item.productId; 
            detail.quantity = item.quantity;
            detail.unitPrice = item.unitPrice;
            detail.subtotal = item.subtotal;
            return detail;
        });
        return model;
    }

    async createTransactionally(order: Order, updatedProducts: Product[]): Promise<Order> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const orderModel = this.toModel(order);
            await queryRunner.manager.save(OrderModel, orderModel);

            for (const product of updatedProducts) {
                await queryRunner.manager.update(ProductModel, product.id, { stock: product.stock });
            }

            await queryRunner.commitTransaction();
            return order;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

   async cancelTransactionally(id: string, updatedProducts: Product[]): Promise<Order> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.update(OrderModel, id, { status: 'CANCELED' });

            for (const product of updatedProducts) {
                await queryRunner.manager.update(ProductModel, product.id, { stock: product.stock });
            }

            await queryRunner.commitTransaction();
            const order = await this.findById(id);
            if (!order) {
                throw new Error(`La orden ${id} no fue encontrada después de confirmar la transacción`);
            }
            return order;
            
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findById(id: string): Promise<Order | null> {
        const model = await this.repository.findOne({ 
            where: { id },
            relations: {items: true}
        });
        return model ? this.toDomain(model) : null;
    }

    async findAll(page: number, limit: number): Promise<PaginatedOrderResult> {
        const [models, total] = await this.repository.findAndCount({
            relations: {items: true},
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' } 
        });
        return { items: models.map(m => this.toDomain(m)), total };
    }

    async getSalesMetrics(startDate?: Date, endDate?: Date, limit?: number): Promise<ProductSalesMetric[]> {
        const query = this.dataSource.createQueryBuilder(OrderDetailModel, 'detail')
            .innerJoin('detail.order', 'order')
            .innerJoin('detail.product', 'product')
            .select([
                'detail.productId AS productId',
                'product.name AS productName',
                'SUM(detail.quantity) AS quantitySold',
                'SUM(detail.subtotal) AS totalRevenue'
            ])
            .where('order.status = :status', { status: 'PAID' }); 

        if (startDate) query.andWhere('order.createdAt >= :startDate', { startDate });
        if (endDate) query.andWhere('order.createdAt <= :endDate', { endDate });

        query.groupBy('detail.productId')
             .addGroupBy('product.name')
             .orderBy('quantitySold', 'DESC'); 

        if (limit) query.limit(limit);

        const rawResults = await query.getRawMany();

        return rawResults.map(row => ({
            productId: row.productId,
            productName: row.productName,
            quantitySold: Number(row.quantitySold),
            totalRevenue: Number(row.totalRevenue)
        }));
    }
}