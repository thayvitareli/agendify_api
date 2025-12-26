import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { BookingEntity } from 'src/modules/booking/infrastructure/entity/booking.entity';
import { UserEntity } from 'src/modules/user/infrastructure/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('barbershops')
export class BarbershopEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerUserId: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @OneToOne(() => UserEntity, (user) => user.barbershop)
  @JoinColumn({ name: 'ownerUserId' })
  ownerUser: UserEntity;

  @OneToMany(() => BarbershopServiceEntity, (service) => service.barbershop)
  services: BarbershopServiceEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.barbershop)
  bookings: BookingEntity[];
}
