import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './entities/product.entity';
import { ApiResponse } from '../config/api-response';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProductList(): Promise<ApiResponse<Product[]>> {
    try {
      const data = await this.productService.getProductList();

      return {
        success: true,
        message: 'Products retrieved successfully',
        data: data,
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve products',
        data: [],
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
