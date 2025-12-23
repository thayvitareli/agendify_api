import { IBookingRepository } from '../domain/repositories/booking.repository';

export class CancelBookingUseCase {
  constructor(private readonly bookingRepo: IBookingRepository) {}

  async execute(input: { id: string }) {
    const booking = await this.bookingRepo.findById(input.id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.cancel();

    await this.bookingRepo.save(booking);

    return booking;
  }
}
