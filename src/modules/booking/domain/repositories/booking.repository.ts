import { Booking } from '../model/booking.model';

export interface IBookingRepository {
  save(booking: Booking): Promise<Booking | null>;
  findById(id: string): Promise<Booking | null>;
  findManyByCustomerId(
    customerId: string,
    options?: {
      page?: number;
      limit?: number;
      sortBy?: 'startAt' | 'endAt' | 'status';
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<{ bookings: Booking[]; total: number }>;
  findManyByBarbershopId(
    barbershopId: string,
    options?: {
      page?: number;
      limit?: number;
      sortBy?: 'startAt' | 'endAt' | 'status';
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<{ bookings: Booking[]; total: number }>;
  findManyByBarbershopIdBetween(
    barbershopId: string,
    from: Date,
    to: Date,
  ): Promise<Booking[]>;
}
