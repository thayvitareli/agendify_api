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

  async execute(
    actorUserId: string,
    input?: {
      page?: number;
      limit?: number;
      sortBy?: 'startAt' | 'endAt' | 'status';
      sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
    },
  ) {
    const customer = await this.customerRepo.findByUserId(actorUserId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (customer.userId !== actorUserId) {
      throw new ForbiddenException(
        'Not allowed to list bookings for this customer',
      );
    }
    const page = input?.page ?? 1;
    const limit = input?.limit ?? 20;
    const sortBy = input?.sortBy ?? 'startAt';
    const sortOrder =
      input?.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const { bookings, total } = await this.bookingRepo.findManyByCustomerId(
      customer.id,
      { page, limit, sortBy, sortOrder },
    );

    return { bookings, total, page, limit };
  }
}
