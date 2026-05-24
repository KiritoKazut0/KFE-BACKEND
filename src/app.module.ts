import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/product.module';
import { OrdersModule } from './orders/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        // synchronize: true,
        extra: {
          connectionLimit: 10,
          waitForConnections: true,
          queueLimit: 1000,
          connectTimeout: 10000,
          idleTimeout: 60000,
        },
      }),
    }),

    UserModule,
    AuthModule,
    CategoryModule,
    ProductsModule,
    OrdersModule
  ],
})
export class AppModule {}