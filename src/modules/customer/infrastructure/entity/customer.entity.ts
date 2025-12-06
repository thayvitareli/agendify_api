import { UserEntity } from 'src/modules/user/infrastructure/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  phone: string | null;

  @OneToOne(() => UserEntity, (user) => user.customer)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
