import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';

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
          entities: [Product],
          synchronize: false,
        };
        return dbConfig;
      },
      inject: [ConfigService],
    }),
    ProductsModule,
  ],
})
export class AppModule {}
