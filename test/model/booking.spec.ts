import { Booking } from '../../src/modules/booking/domain/model/booking.model';

describe('Booking Model', () => {
  it('Should throw an error if end is after start', () => {
    const startDate = new Date('2025-02-01 13:00');
    const endDate = new Date('2025-02-01 12:00');

    expect(
      () =>
        new Booking(
          'shId',
          'barbershopId',
          'customerId',
          'serviceId',
          startDate,
          endDate,
        ),
    ).toThrow('End must be after start.');
  });

  it('Should instance a new Booking', () => {
    const startDate = new Date('2025-02-01 13:00');
    const endDate = new Date('2025-02-01 13:30');

    const booking = new Booking(
      'shId',
      'barbershopId',
      'customerId',
      'serviceId',
      startDate,
      endDate,
    );

    expect(booking.id).toBe('shId');
    expect(booking.barbershopId).toBe('barbershopId');
    expect(booking.serviceId).toBe('serviceId');
    expect(booking.startAt).toBe(startDate);
    expect(booking.endAt).toBe(endDate);
  });

  it('Should throw an error if try cancel a booking cancelled', () => {
    const startDate = new Date('2025-02-01 13:00');
    const endDate = new Date('2025-02-01 13:30');

    const booking = new Booking(
      'shId',
      'barbershopId',
      'customerId',
      'serviceId',
      startDate,
      endDate,
    );

    booking.cancel();

    expect(() => booking.cancel()).toThrow('Booking already canceled.');
  });

  it('Should cancel a booking', () => {
    const startDate = new Date('2025-02-01 13:00');
    const endDate = new Date('2025-02-01 13:30');

    const booking = new Booking(
      'shId',
      'barbershopId',
      'customerId',
      'serviceId',
      startDate,
      endDate,
    );

    booking.cancel();

    expect(booking.status).toBe('CANCELED');
  });
});
