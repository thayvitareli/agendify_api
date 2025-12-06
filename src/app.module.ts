import { Module } from '@nestjs/common';
import { BookingModule } from './modules/booking/booking.module';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [CustomerModule, BookingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
