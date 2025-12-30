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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
      BookingEntity,
      BarbershopServiceEntity,
    ]),
  ],
  controllers: [BookingController],
  providers: [
    RegisterBookingUseCase,
    CancelBookingUseCase,
    { provide: 'IBookingRepository', useClass: TypeORMBookingRepository },
    { provide: 'ICustomerRepository', useClass: TypeORMCustomerRepository },
    {
      provide: 'IBarbershopServiceRepository',
      useClass: TypeORMBarbershopServiceRepository,
    },
  ],
})
export class BookingModule {}
