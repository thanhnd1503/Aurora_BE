import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderItem } from 'src/oder-item/entities/order-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class OrderService {
  constructor(
    private dataSource: DataSource, // Inject DataSource
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    // @InjectRepository(Product)
    // private productRepository: Repository<Product>,
    // @InjectRepository(Customer)
    // private customerRepository: Repository<Customer>,
  ) {}

  async getOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }
  async createOrder(createOrderDto: CreateOrderDTO): Promise<Order> {
    // Khởi tạo transaction với query runner
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Kiểm tra customer (trong transaction)
      const customer = await queryRunner.manager.findOne(Customer, {
        where: { id: createOrderDto.customerId },
      });

      if (!customer) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }

      // 2. Xử lý order items
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const itemDto of createOrderDto.orderItems) {
        // Lấy product với lock
        const product = await queryRunner.manager.findOne(Product, {
          where: { productId: itemDto.productId },
          lock: { mode: 'pessimistic_write' },
        });

        // Validate
        if (!product)
          throw new HttpException(
            `Product ${itemDto.name} not found`,
            HttpStatus.NOT_FOUND,
          );
        if (product.stock < itemDto.quantity) {
          throw new HttpException(
            `Insufficient stock for ${product.name}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        // Tính toán
        const subtotal = itemDto.quantity * product.price;
        totalAmount += subtotal;

        // Tạo order item
        orderItems.push(
          queryRunner.manager.create(OrderItem, {
            quantity: itemDto.quantity,
            subtotal,
            product,
          }),
        );

        // Cập nhật stock
        product.stock -= itemDto.quantity;
        await queryRunner.manager.save(product);
      }

      // 3. Tạo và lưu order
      const order = queryRunner.manager.create(Order, {
        orderDate: new Date(),
        status: 'pending',
        totalAmount,
        customer,
        items: orderItems,
      });

      const savedOrder = await queryRunner.manager.save(order);

      await Promise.all(
        orderItems.map(async (item) => {
          const orderItem = queryRunner.manager.create(OrderItem, {
            quantity: item.quantity,
            subtotal: item.subtotal,
            product: item.product,
            order: savedOrder,
          });

          // Lưu từng item vào database
          await queryRunner.manager.save(orderItem);

          return orderItem; // Trả về orderItem đã lưu
        }),
      );

      // Commit transaction nếu thành công
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      // Giải phóng query runner
      await queryRunner.release();
    }
  }
}
