import { Module } from '@nestjs/common';
import { BookingModule } from './modules/booking/booking.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [CustomerModule, BookingModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
