import { Booking } from 'src/modules/booking/domain/model/booking.model';
import { CancelBookingUseCase } from 'src/modules/booking/use-cases/cancel-booking.use-case';
import { IBookingRepository } from 'src/modules/booking/domain/repositories/booking.repository';
import { ICustomerRepository } from 'src/modules/customer/domain/repositories/customer.repository';
import { Customer } from 'src/modules/customer/domain/model/customer.model';
import { IBarbershopRepository } from 'src/modules/barbershop/domain/repositories/barbershop.repository';
import { Barbershop } from 'src/modules/barbershop/domain/model/barbershop.model';
import { Address } from 'src/modules/barbershop/domain/value_objects/address.vo';

describe('CancelBookingUseCase', () => {
  const bookingRepo: jest.Mocked<IBookingRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findManyByCustomerId: jest.fn(),
    findManyByBarbershopId: jest.fn(),
    findManyByBarbershopIdBetween: jest.fn(),
  };

  const customerRepo: jest.Mocked<ICustomerRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findByEmail: jest.fn(),
  };

  const barbershopRepo: jest.Mocked<IBarbershopRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByOwnerUserId: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    bookingRepo.findById.mockResolvedValue(null);
    bookingRepo.save.mockResolvedValue({} as any);
    customerRepo.findById.mockResolvedValue(null);
    barbershopRepo.findById.mockResolvedValue(null);
  });

  it('should throw NotFoundException when booking is not found', async () => {
    const useCase = new CancelBookingUseCase(
      bookingRepo,
      customerRepo,
      barbershopRepo,
    );

    await expect(useCase.execute({ id: 'b-id' }, 'u-1')).rejects.toThrow(
      'Booking not found',
    );
  });

  it('should cancel when actor is the booking customer user', async () => {
    const existingBooking = new Booking(
      'b-id',
      'shop-1',
      'c-1',
      's-1',
      new Date('2025-12-24T10:00:00Z'),
      new Date('2025-12-24T10:30:00Z'),
    );
    bookingRepo.findById.mockResolvedValueOnce(existingBooking);
    customerRepo.findById.mockResolvedValueOnce(
      new Customer('c-1', 'u-customer', '99999999'),
    );

    const useCase = new CancelBookingUseCase(
      bookingRepo,
      customerRepo,
      barbershopRepo,
    );

    const result = await useCase.execute({ id: 'b-id' }, 'u-customer');

    expect(bookingRepo.save).toHaveBeenCalledWith(existingBooking);
    expect(result.status).toBe('CANCELED');
    expect(result.canceledAt).toBeInstanceOf(Date);
  });

  it('should cancel when actor is the barbershop owner', async () => {
    const existingBooking = new Booking(
      'b-id',
      'shop-1',
      'c-1',
      's-1',
      new Date('2025-12-24T10:00:00Z'),
      new Date('2025-12-24T10:30:00Z'),
    );
    bookingRepo.findById.mockResolvedValueOnce(existingBooking);
    barbershopRepo.findById.mockResolvedValueOnce(
      new Barbershop(
        'shop-1',
        'u-owner',
        '99999999',
        'Shop',
        new Address('Main', '1', 'City', 'ST', '00000'),
      ),
    );

    const useCase = new CancelBookingUseCase(
      bookingRepo,
      customerRepo,
      barbershopRepo,
    );

    const result = await useCase.execute({ id: 'b-id' }, 'u-owner');

    expect(bookingRepo.save).toHaveBeenCalledWith(existingBooking);
    expect(result.status).toBe('CANCELED');
  });

  it('should throw ForbiddenException when actor is neither customer nor owner', async () => {
    const existingBooking = new Booking(
      'b-id',
      'shop-1',
      'c-1',
      's-1',
      new Date('2025-12-24T10:00:00Z'),
      new Date('2025-12-24T10:30:00Z'),
    );
    bookingRepo.findById.mockResolvedValueOnce(existingBooking);
    customerRepo.findById.mockResolvedValueOnce(
      new Customer('c-1', 'u-customer', '99999999'),
    );
    barbershopRepo.findById.mockResolvedValueOnce(
      new Barbershop(
        'shop-1',
        'u-owner',
        '99999999',
        'Shop',
        new Address('Main', '1', 'City', 'ST', '00000'),
      ),
    );

    const useCase = new CancelBookingUseCase(
      bookingRepo,
      customerRepo,
      barbershopRepo,
    );

    await expect(useCase.execute({ id: 'b-id' }, 'u-other')).rejects.toThrow(
      'Not allowed to cancel this booking',
    );

    expect(bookingRepo.save).not.toHaveBeenCalled();
  });
});
