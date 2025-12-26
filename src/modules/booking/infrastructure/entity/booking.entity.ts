import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

const datetimeColumnType =
  (process.env.DB_TYPE ?? process.env.TYPEORM_CONNECTION ?? '').toLowerCase() ===
  'postgres'
    ? 'timestamptz'
    : 'datetime';

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

  @Column({ type: datetimeColumnType })
  startAt: Date;

  @Column({ type: datetimeColumnType })
  endAt: Date;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';

  @Column({ type: datetimeColumnType, nullable: true })
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
