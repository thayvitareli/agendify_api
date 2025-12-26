import { Booking } from '../model/booking.model';

export interface IBookingRepository {
  save(booking: Booking): Promise<Booking | null>;
  findById(id: string): Promise<Booking | null>;
  findManyByCustomerId(customerId: string): Promise<Booking[]>;
  findManyByBarbershopId(barbershopId: string): Promise<Booking[]>;
  findManyByBarbershopIdBetween(
    barbershopId: string,
    from: Date,
    to: Date,
  ): Promise<Booking[]>;
}
