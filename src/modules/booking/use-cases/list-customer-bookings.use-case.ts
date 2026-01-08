import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import type { IBookingRepository } from '../domain/repositories/booking.repository';
import type { ICustomerRepository } from 'src/modules/customer/domain/repositories/customer.repository';

export class ListCustomerBookingsUseCase {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepo: IBookingRepository,
    @Inject('ICustomerRepository')
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(actorUserId: string) {
    const customer = await this.customerRepo.findByUserId(actorUserId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (customer.userId !== actorUserId) {
      throw new ForbiddenException(
        'Not allowed to list bookings for this customer',
      );
    }
    const bookings = await this.bookingRepo.findManyByCustomerId(customer.id);

    return { bookings };
  }
}
