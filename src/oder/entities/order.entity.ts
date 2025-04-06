import { Customer } from 'src/customer/entities/customer.entity';
import { OrderItem } from 'src/oder-item/entities/order-item.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'order_date', type: 'date' })
  orderDate: Date;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ name: 'total_amount' })
  totalAmount: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'cus_id' })
  customer: Customer;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];
}
