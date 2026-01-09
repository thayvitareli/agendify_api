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
      database: process.env.SQLITE_PATH ?? './agendify.sqlite',
      entities: [
        CustomerEntity,
        UserEntity,
        BookingEntity,
        BarbershopEntity,
        BarbershopServiceEntity,
      ],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      dropSchema: false,
      logging: process.env.TYPEORM_LOGGING === 'true',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
