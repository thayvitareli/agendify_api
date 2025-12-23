import { Booking } from '../model/booking.model';

export interface IBookingRepository {
  save(booking: Booking): Promise<void>;
  findById(id: string): Promise<Booking | null>;
  findByCustomerId(customerId: string): Promise<Booking[]>;
  findByBarbershopId(barbershopId: string): Promise<Booking[]>;
  findByBarbershopIdBetween(
    barbershopId: string,
    from: Date,
    to: Date,
  ): Promise<Booking[]>;
}
