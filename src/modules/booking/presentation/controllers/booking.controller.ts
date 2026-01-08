import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RegisterBookingUseCase } from '../../use-cases/register-booking.use-case';
import { RegisterBookingDto } from '../dtos/register-booking.dto';
import { CancelBookingUseCase } from '../../use-cases/cancel-booking.use-case';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import type { AuthUser } from 'src/modules/auth/presentation/types/auth-user';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(
    private readonly registerBookingUseCase: RegisterBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
  ) {}

  @Post()
  registerBooking(@Body() body: RegisterBookingDto, @CurrentUser() user: AuthUser) {
    return this.registerBookingUseCase.execute(body, user.userId);
  }

  @Post(':id/cancel')
  cancelBooking(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.cancelBookingUseCase.execute({ id }, user.userId);
  }
}
