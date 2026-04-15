import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('booking_payments')
export class BookingPaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  bookingId: string;

  @Column()
  stripePaymentIntentId: string;

  @Column({ nullable: true })
  clientSecret: string;

  @Column('int')
  amountCents: number;

  @Column('int')
  platformFeeCents: number;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

  @CreateDateColumn()
  createdAt: Date;
}
