import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import type { IBookingRepository } from '../domain/repositories/booking.repository';
import type { IBarbershopRepository } from 'src/modules/barbershop/domain/repositories/barbershop.repository';

export class ListBarbershopBookingsUseCase {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepo: IBookingRepository,
    @Inject('IBarbershopRepository')
    private readonly barbershopRepo: IBarbershopRepository,
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
    const barbershop = await this.barbershopRepo.findByOwnerUserId(actorUserId);

    if (!barbershop) {
      throw new NotFoundException('Barbershop not found');
    }
    if (barbershop.ownerUserId !== actorUserId) {
      throw new ForbiddenException(
        'Not allowed to list bookings for this barbershop',
      );
    }

    const page = input?.page ?? 1;
    const limit = input?.limit ?? 20;
    const sortBy = input?.sortBy ?? 'startAt';
    const sortOrder =
      input?.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const { bookings, total } = await this.bookingRepo.findManyByBarbershopId(
      barbershop.id,
      { page, limit, sortBy, sortOrder },
    );

    return { bookings, total, page, limit };
  }
}
