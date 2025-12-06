import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => CustomerEntity, (customer) => customer.user, {
    cascade: true,
  })
  customer?: CustomerEntity;

  @OneToOne(() => BarbershopEntity, (shop) => shop.ownerUser, {
    cascade: true,
  })
  barbershop?: BarbershopEntity;
}
