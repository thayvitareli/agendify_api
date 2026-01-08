import { Booking } from 'src/modules/booking/domain/model/booking.model';
import { IBookingRepository } from 'src/modules/booking/domain/repositories/booking.repository';
import { ListBarbershopBookingsUseCase } from 'src/modules/booking/use-cases/list-barbershop-bookings.use-case';
import { Barbershop } from 'src/modules/barbershop/domain/model/barbershop.model';
import { Address } from 'src/modules/barbershop/domain/value_objects/address.vo';
import { IBarbershopRepository } from 'src/modules/barbershop/domain/repositories/barbershop.repository';

describe('ListBarbershopBookingsUseCase', () => {
  const bookingRepo: jest.Mocked<IBookingRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findManyByCustomerId: jest.fn(),
    findManyByBarbershopId: jest.fn(),
    findManyByBarbershopIdBetween: jest.fn(),
  };

  const barbershopRepo: jest.Mocked<IBarbershopRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByOwnerUserId: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    barbershopRepo.findByOwnerUserId.mockResolvedValue(
      new Barbershop(
        'shop-1',
        'user-1',
        '99999999',
        'Shop',
        new Address('Main', '1', 'City', 'ST', '00000'),
      ),
    );
    bookingRepo.findManyByBarbershopId.mockResolvedValue([
      new Booking(
        'booking-1',
        'shop-1',
        'customer-1',
        'service-1',
        new Date('2025-12-24T10:00:00Z'),
        new Date('2025-12-24T10:30:00Z'),
      ),
      new Booking(
        'booking-2',
        'shop-1',
        'customer-2',
        'service-1',
        new Date('2025-12-24T11:00:00Z'),
        new Date('2025-12-24T11:30:00Z'),
      ),
    ]);
  });

  it('should throw NotFoundException when barbershop is not found', async () => {
    barbershopRepo.findByOwnerUserId.mockResolvedValueOnce(null);

    const useCase = new ListBarbershopBookingsUseCase(
      bookingRepo,
      barbershopRepo,
    );

    await expect(useCase.execute('user-1')).rejects.toThrow(
      'Barbershop not found',
    );
  });

  it('should throw ForbiddenException when actor does not own barbershop', async () => {
    barbershopRepo.findByOwnerUserId.mockResolvedValueOnce(
      new Barbershop(
        'shop-1',
        'user-other',
        '99999999',
        'Shop',
        new Address('Main', '1', 'City', 'ST', '00000'),
      ),
    );

    const useCase = new ListBarbershopBookingsUseCase(
      bookingRepo,
      barbershopRepo,
    );

    await expect(useCase.execute('user-1')).rejects.toThrow(
      'Not allowed to list bookings for this barbershop',
    );
  });

  it('should list barbershop bookings', async () => {
    const useCase = new ListBarbershopBookingsUseCase(
      bookingRepo,
      barbershopRepo,
    );

    const result = await useCase.execute('user-1');

    expect(barbershopRepo.findByOwnerUserId).toHaveBeenCalledWith('user-1');
    expect(bookingRepo.findManyByBarbershopId).toHaveBeenCalledWith('shop-1');
    expect(result.bookings).toHaveLength(2);
    expect(result.bookings[0]).toBeInstanceOf(Booking);
  });
});
