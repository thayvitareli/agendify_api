import { Module } from '@nestjs/common';
import { CustomerController } from './presentation/controllers/customer.controller';
import { RegisterCustomerUseCase } from './use-cases/register-customer.use-case';
import { TypeORMCustomerRepository } from './infrastructure/repositories/typeorm-customer.repository';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './infrastructure/entity/customer.entity';
import { UserEntity } from '../user/infrastructure/entity/user.entity';
import { TypeORMUserRepository } from '../user/infrastructure/repositories/type-orm-user.repository';
import { BcryptPasswordHasherAdapter } from '../auth/infrasctructure/bcrypt-password-hasher.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, UserEntity])],
  controllers: [CustomerController],
  providers: [
    RegisterCustomerUseCase,
    {
      provide: 'ICustomerRepository',
      useClass: TypeORMCustomerRepository,
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
export class CustomerModule {}
