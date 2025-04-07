import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn({ name: 'payment_id' })
  paymentId: number;

  @Column({ name: 'payment_date' })
  paymentDate: Date;

  @Column({ type: 'int', default: 0 })
  amount: number;

  @Column({ name: 'payment_method', type: 'varchar', length: 100 })
  paymentMethod: string;
}
