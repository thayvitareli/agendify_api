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

  async execute(actorUserId: string) {
    const barbershop = await this.barbershopRepo.findByOwnerUserId(actorUserId);

    if (!barbershop) {
      throw new NotFoundException('Barbershop not found');
    }
    if (barbershop.ownerUserId !== actorUserId) {
      throw new ForbiddenException(
        'Not allowed to list bookings for this barbershop',
      );
    }

    const bookings = await this.bookingRepo.findManyByBarbershopId(
      barbershop.id,
    );

    return { bookings };
  }
}
