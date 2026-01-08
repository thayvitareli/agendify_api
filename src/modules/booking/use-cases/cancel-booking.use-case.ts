import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import type { IBookingRepository } from '../domain/repositories/booking.repository';
import type { ICustomerRepository } from 'src/modules/customer/domain/repositories/customer.repository';
import type { IBarbershopRepository } from 'src/modules/barbershop/domain/repositories/barbershop.repository';

export class CancelBookingUseCase {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepo: IBookingRepository,
    @Inject('ICustomerRepository')
    private readonly customerRepo: ICustomerRepository,
    @Inject('IBarbershopRepository')
    private readonly barbershopRepo: IBarbershopRepository,
  ) {}

  async execute(input: { id: string }, actorUserId: string) {
    const booking = await this.bookingRepo.findById(input.id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const customer = await this.customerRepo.findById(booking.customerId);
    const isCustomerOwner = customer?.userId === actorUserId;

    const barbershop = await this.barbershopRepo.findById(booking.barbershopId);
    const isShopOwner = barbershop?.ownerUserId === actorUserId;

    if (!isCustomerOwner && !isShopOwner) {
      throw new ForbiddenException('Not allowed to cancel this booking');
    }

    booking.cancel();

    await this.bookingRepo.save(booking);

    return booking;
  }
}
