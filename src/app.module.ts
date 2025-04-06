import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { ProductModule } from './products/product.module';
import { OrderModule } from './oder/order.module';
import { UserModule } from './customer/customer.module';
import { OrderItemModule } from './oder-item/order-item.module';
import { Customer } from './customer/entities/customer.entity';
import { Order } from './oder/entities/order.entity';
import { OrderItem } from './oder-item/entities/order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbConfig: TypeOrmModuleOptions = {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: +(configService.get<number>('DB_PORT') ?? 3306),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [Product, Customer, Order, OrderItem],
          synchronize: false,
        };
        return dbConfig;
      },
      inject: [ConfigService],
    }),
    ProductModule,
    OrderModule,
    UserModule,
    OrderItemModule,
  ],
})
export class AppModule {}
