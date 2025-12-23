import { IBookingRepository } from '../domain/repositories/booking.repository';
import { Booking } from '../domain/model/booking.model';
import { ICustomerRepository } from 'src/modules/customer/domain/repositories/customer.repository';
import { IBarbershopServiceRepository } from 'src/modules/barbershop-service/domain/repositories/barbershop-service.repository';

export class RegisterBookingUseCase {
  constructor(
    private readonly bookingRepo: IBookingRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly barbershopServiceRepo: IBarbershopServiceRepository,
  ) {}

  async execute(input: {
    id: string;
    barbershopId: string;
    customerId: string;
    serviceId: string;
    startAt: Date;
  }) {
    const customer = await this.customerRepo.findById(input.customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const service = await this.barbershopServiceRepo.findById(input.serviceId);

    if (!service) {
      throw new Error('Barbershop service not found');
    }

    const endAt = new Date(
      input.startAt.getTime() + service.durationMinutes * 60000,
    );

    const dayStart = new Date(input.startAt);

    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);

    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const bookings = await this.bookingRepo.findByBarbershopIdBetween(
      input.barbershopId,
      dayStart,
      dayEnd,
    );

    const overlaps = bookings.some((b) => {
      if (b.status === 'CANCELED') return false;
      return input.startAt < b.endAt && b.startAt < endAt;
    });

    if (overlaps) {
      throw new Error('Booking time conflict');
    }

    const booking = new Booking(
      input.id,
      input.barbershopId,
      input.customerId,
      input.serviceId,
      input.startAt,
      endAt,
    );

    await this.bookingRepo.save(booking);

    return booking;
  }
}
