import { Module } from '@nestjs/common';
import { BarbershopController } from './presentation/controller/barbershop.controller';
import { RegisterBarbershopUseCase } from './use-cases/register-barbershop.use-case';
import { TypeORMUserRepository } from '../user/infrastructure/repositories/type-orm-user.repository';
import { TypeORMCustomerRepository } from '../customer/infrastructure/repositories/typeorm-customer.repository';
import { BcryptPasswordHasherAdapter } from '../auth/infrasctructure/bcrypt-password-hasher.adapter';
import { TypeORMBarbershopRepository } from './infrastructure/repositories/typeorm-barbershop.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarbershopEntity } from './infrastructure/entity/barbershop.entity';
import { UserEntity } from '../user/infrastructure/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BarbershopEntity, UserEntity])],

  controllers: [BarbershopController],
  providers: [
    RegisterBarbershopUseCase,
    {
      provide: 'IBarbershopRepository',
      useClass: TypeORMBarbershopRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: TypeORMUserRepository,
    },
    {
      provide: 'IPasswordHasher',
      useClass: BcryptPasswordHasherAdapter,
    },
  ],
})
export class BarbershopModule {}
