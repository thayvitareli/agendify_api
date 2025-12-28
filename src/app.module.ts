import { Module } from '@nestjs/common';
import { BookingModule } from './modules/booking/booking.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './modules/customer/infrastructure/entity/customer.entity';
import { UserEntity } from './modules/user/infrastructure/entity/user.entity';
import { BookingEntity } from './modules/booking/infrastructure/entity/booking.entity';
import { BarbershopEntity } from './modules/barbershop/infrastructure/entity/barbershop.entity';
import { BarbershopServiceEntity } from './modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { BarbershopModule } from './modules/barbershop/barbershop.module';
import { BarbershopServiceModule } from './modules/barbershop-service/barbershop-service.module';

@Module({
  imports: [
    CustomerModule,
    BarbershopModule,
    BarbershopServiceModule,
    BookingModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [
        CustomerEntity,
        UserEntity,
        BookingEntity,
        BarbershopEntity,
        BarbershopServiceEntity,
      ],
      synchronize: true,
      dropSchema: true,
      logging: false,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
