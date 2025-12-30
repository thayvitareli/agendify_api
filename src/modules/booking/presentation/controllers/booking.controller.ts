import { Body, Controller, Param, Post } from '@nestjs/common';
import { RegisterBookingUseCase } from '../../use-cases/register-booking.use-case';
import { RegisterBookingDto } from '../dtos/register-booking.dto';
import { CancelBookingUseCase } from '../../use-cases/cancel-booking.use-case';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly registerBookingUseCase: RegisterBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
  ) {}

  @Post()
  registerBooking(@Body() body: RegisterBookingDto) {
    return this.registerBookingUseCase.execute(body);
  }

  @Post(':id/cancel')
  cancelBooking(@Param('id') id: string) {
    return this.cancelBookingUseCase.execute({ id });
  }
}
