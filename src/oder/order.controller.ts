import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { CreateOrderDTO } from './dtos/create-order.dto';
import { ApiResponse } from 'src/config/api-response';
import { OrderService } from './order.service';

@Controller('orders') // Nên dùng số nhiều cho RESTful API
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDTO,
  ): Promise<ApiResponse<any>> {
    const timestamp = new Date().toISOString();

    try {
      const data = await this.orderService.createOrder(createOrderDto);

      return {
        success: true,
        message: 'Tạo đơn hàng thành công',
        data,
        statusCode: HttpStatus.CREATED,
        timestamp,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          message: error.message,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
