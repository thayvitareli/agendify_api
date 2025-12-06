import { Module } from '@nestjs/common';
import { BookingController } from './presentation/controllers/booking.controller';

@Module({
  controllers: [BookingController],
})
export class BookingModule {}
