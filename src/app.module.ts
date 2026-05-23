import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || 'localhost',
      port: Number.parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'kfe_database',
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        connectionLimit: 10,       
        waitForConnections: true,
        queueLimit: 1000,    
        connectTimeout: 10000,    
        idleTimeout: 60000        
    }
    }),

    UserModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

