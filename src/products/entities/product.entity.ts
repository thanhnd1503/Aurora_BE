import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image: string;

  @Column({ name: 'is_available', type: 'int', default: 1 })
  isAvailable: number;
}
