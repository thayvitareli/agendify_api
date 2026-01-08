import { Booking } from '../../domain/model/booking.model';

export interface BookingHttp {
  id: string;
  barbershopId: string;
  customerId: string;
  serviceId: string;
  startAt: Date;
  endAt: Date;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  canceledAt: Date | null;
}

export class BookingPresenter {
  static toHttp(booking: Booking): BookingHttp {
    return {
      id: booking.id,
      barbershopId: booking.barbershopId,
      customerId: booking.customerId,
      serviceId: booking.serviceId,
      startAt: booking.startAt,
      endAt: booking.endAt,
      status: booking.status,
      canceledAt: booking.canceledAt ?? null,
    };
  }

  static toHttpMany(bookings: Booking[]): BookingHttp[] {
    return bookings.map((booking) => this.toHttp(booking));
  }
}
