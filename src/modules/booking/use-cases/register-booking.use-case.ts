import type { IBookingRepository } from '../domain/repositories/booking.repository';
import { Booking } from '../domain/model/booking.model';
import type { ICustomerRepository } from 'src/modules/customer/domain/repositories/customer.repository';
import type { IBarbershopServiceRepository } from 'src/modules/barbershop-service/domain/repositories/barbershop-service.repository';
import { v4 as uuid } from 'uuid';
import { RegisterBookingDto } from '../presentation/dtos/register-booking.dto';
import { ForbiddenException, Inject } from '@nestjs/common';

export class RegisterBookingUseCase {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepo: IBookingRepository,
    @Inject('ICustomerRepository')
    private readonly customerRepo: ICustomerRepository,
    @Inject('IBarbershopServiceRepository')
    private readonly barbershopServiceRepo: IBarbershopServiceRepository,
  ) {}

  async execute(input: RegisterBookingDto, actorUserId: string) {
    const customer = await this.customerRepo.findById(input.customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (customer.userId !== actorUserId) {
      throw new ForbiddenException('Not allowed to create booking for customer');
    }

    const service = await this.barbershopServiceRepo.findById(input.serviceId);

    if (!service) {
      throw new Error('Barbershop service not found');
    }

    const endAt = new Date(
      typeof input.startAt == 'string'
        ? new Date(input.startAt).getTime() + service.durationMinutes * 60000
        : input.startAt.getTime() + service.durationMinutes * 60000,
    );

    const dayStart = new Date(input.startAt);

    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);

    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const bookings = await this.bookingRepo.findManyByBarbershopIdBetween(
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
      uuid(),
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
