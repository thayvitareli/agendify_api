import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('services')
export class BarbershopServiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  barbershopId: string;

  @Column()
  name: string;

  @Column()
  durationMinutes: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => BarbershopEntity, (shop) => shop.services)
  @JoinColumn({ name: 'barbershopId' })
  barbershop: BarbershopEntity;
}
