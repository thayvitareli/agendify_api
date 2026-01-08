import { Module } from '@nestjs/common';
import { BookingController } from './presentation/controllers/booking.controller';
import { TypeORMBookingRepository } from './infrastructure/repositories/typeorm-booking.repository';
import { RegisterBookingUseCase } from './use-cases/register-booking.use-case';
import { TypeORMCustomerRepository } from '../customer/infrastructure/repositories/typeorm-customer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '../customer/infrastructure/entity/customer.entity';
import { BookingEntity } from './infrastructure/entity/booking.entity';
import { BarbershopServiceEntity } from '../barbershop-service/infrastructure/entity/barbershop-service.entity';
import { TypeORMBarbershopServiceRepository } from '../barbershop-service/infrastructure/repositories/typeorm-barbershop-service.repository';
import { CancelBookingUseCase } from './use-cases/cancel-booking.use-case';
import { AuthModule } from '../auth/auth.module';
import { BarbershopEntity } from '../barbershop/infrastructure/entity/barbershop.entity';
import { TypeORMBarbershopRepository } from '../barbershop/infrastructure/repositories/typeorm-barbershop.repository';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
      BookingEntity,
      BarbershopServiceEntity,
      BarbershopEntity,
    ]),
    AuthModule,
  ],
  controllers: [BookingController],
  providers: [
    RegisterBookingUseCase,
    CancelBookingUseCase,
    JwtAuthGuard,
    { provide: 'IBookingRepository', useClass: TypeORMBookingRepository },
    { provide: 'ICustomerRepository', useClass: TypeORMCustomerRepository },
    {
      provide: 'IBarbershopServiceRepository',
      useClass: TypeORMBarbershopServiceRepository,
    },
    {
      provide: 'IBarbershopRepository',
      useClass: TypeORMBarbershopRepository,
    },
  ],
})
export class BookingModule {}
