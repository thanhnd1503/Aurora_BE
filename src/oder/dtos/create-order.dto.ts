import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDTO {
  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDTO {
  @IsString()
  @IsNotEmpty()
  customerId: number;

  @IsArray()
  @Type(() => OrderItemDTO)
  orderItems: OrderItemDTO[];
}
