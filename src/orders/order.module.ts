import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModel } from './infrastructure/persistence/order.model';
import { OrderDetailModel } from './infrastructure/persistence/order-detail.model';
import { ProductsModule } from '../products/product.module';
import { OrdersController } from './infrastructure/controllers/order.controller';
import { MysqlOrderRepository } from './infrastructure/persistence/mysql-order.repository';
import { CreateOrderUseCase } from './application/createOrderUseCase';
import { MysqlProductRepository } from '../products/infrastructure/persistence/mysql-product.repository';
import { CancelOrderUseCase } from './application/cancelOrderUseCase';
import { ListOrdersUseCase } from './application/listOrdersUseCase';
import { GetProductSalesUseCase } from './application/getProductSalesUseCase';
import { SecurityModule } from '../core/security/security.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([OrderModel, OrderDetailModel]),
        ProductsModule,
        SecurityModule
    ],
    controllers: [ OrdersController ],
    providers: [
        MysqlOrderRepository,

        {
            provide: CreateOrderUseCase,
            useFactory: (orderRepo: MysqlOrderRepository, productRepo: MysqlProductRepository) => {
                return new CreateOrderUseCase(orderRepo, productRepo);
            },
            inject: [MysqlOrderRepository, MysqlProductRepository]
        },
        {
            provide: CancelOrderUseCase,
            useFactory: (orderRepo: MysqlOrderRepository, productRepo: MysqlProductRepository) => {
                return new CancelOrderUseCase(orderRepo, productRepo);
            },
            inject: [MysqlOrderRepository, MysqlProductRepository]
        },
        {
            provide: ListOrdersUseCase,
            useFactory: (orderRepo: MysqlOrderRepository) => {
                return new ListOrdersUseCase(orderRepo);
            },
            inject: [MysqlOrderRepository]
        },
        {
            provide: GetProductSalesUseCase,
            useFactory: (orderRepo: MysqlOrderRepository) => {
                return new GetProductSalesUseCase(orderRepo);
            },
            inject: [MysqlOrderRepository]
        }
    ]
})
export class OrdersModule {}