import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  barbershopId: string;

  @Column()
  customerId: string;

  @Column()
  serviceId: string;

  @Column({ type: 'timestamptz' })
  startAt: Date;

  @Column({ type: 'timestamptz' })
  endAt: Date;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';

  @Column({ type: 'timestamptz', nullable: true })
  canceledAt?: Date | null;

  @ManyToOne(() => BarbershopEntity, (shop) => shop.bookings)
  @JoinColumn({ name: 'barbershopId' })
  barbershop: BarbershopEntity;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ManyToOne(() => BarbershopServiceEntity)
  @JoinColumn({ name: 'serviceId' })
  service: BarbershopServiceEntity;
}
