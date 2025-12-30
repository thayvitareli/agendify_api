import { Inject, NotFoundException } from '@nestjs/common';
import type { IBookingRepository } from '../domain/repositories/booking.repository';

export class CancelBookingUseCase {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepo: IBookingRepository,
  ) {}

  async execute(input: { id: string }) {
    const booking = await this.bookingRepo.findById(input.id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking.cancel();

    await this.bookingRepo.save(booking);

    return booking;
  }
}
