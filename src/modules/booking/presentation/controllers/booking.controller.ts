import { Body, Controller, Post } from '@nestjs/common';
import { RegisterBookingUseCase } from '../../use-cases/register-booking.use-case';
import { RegisterBookingDto } from '../dtos/register-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly registerBookingUseCase: RegisterBookingUseCase,
  ) {}

  @Post()
  registerBooking(@Body() body: RegisterBookingDto) {
    return this.registerBookingUseCase.execute(body);
  }
}
