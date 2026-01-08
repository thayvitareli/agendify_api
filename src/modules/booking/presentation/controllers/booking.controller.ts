import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RegisterBookingUseCase } from '../../use-cases/register-booking.use-case';
import { RegisterBookingDto } from '../dtos/register-booking.dto';
import { CancelBookingUseCase } from '../../use-cases/cancel-booking.use-case';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import type { AuthUser } from 'src/modules/auth/presentation/types/auth-user';
import { ListCustomerBookingsUseCase } from '../../use-cases/list-customer-bookings.use-case';
import { ListBarbershopBookingsUseCase } from '../../use-cases/list-barbershop-bookings.use-case';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(
    private readonly registerBookingUseCase: RegisterBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
    private readonly listCustomerBookingsUseCase: ListCustomerBookingsUseCase,
    private readonly listBarbershopBookingsUseCase: ListBarbershopBookingsUseCase,
  ) {}

  @Post()
  registerBooking(
    @Body() body: RegisterBookingDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.registerBookingUseCase.execute(body, user.userId);
  }

  @Post(':id/cancel')
  cancelBooking(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.cancelBookingUseCase.execute({ id }, user.userId);
  }

  @Get('customer')
  async listCustomerBookings(@CurrentUser() user: AuthUser) {
    return await this.listCustomerBookingsUseCase.execute(user.userId);
  }

  @Get('barbershop')
  async listBarbershopBookings(@CurrentUser() user: AuthUser) {
    return await this.listBarbershopBookingsUseCase.execute(user.userId);
  }
}
