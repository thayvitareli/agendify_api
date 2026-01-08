import { IBarbershopServiceRepository } from 'src/modules/barbershop-service/domain/repositories/barbershop-service.repository';
import { Booking } from 'src/modules/booking/domain/model/booking.model';
import { IBookingRepository } from 'src/modules/booking/domain/repositories/booking.repository';
import { RegisterBookingUseCase } from 'src/modules/booking/use-cases/register-booking.use-case';
import { ICustomerRepository } from 'src/modules/customer/domain/repositories/customer.repository';
import { Customer } from 'src/modules/customer/domain/model/customer.model';
import { BarbershopService } from 'src/modules/barbershop-service/domain/model/barbershop-service.model';

describe('RegisterBookingUseCase', () => {
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
    findByEmail: jest.fn(),
  };

  const barbershopServiceRepo: jest.Mocked<IBarbershopServiceRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByBarbershopId: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    bookingRepo.findManyByBarbershopIdBetween.mockResolvedValue([]);
    bookingRepo.save.mockResolvedValue({} as any);
    customerRepo.findById.mockResolvedValue(
      new Customer('c-1', 'u-1', '999999999'),
    );
    barbershopServiceRepo.findById.mockResolvedValue(
      new BarbershopService('s-1', 'shop-1', 'Service', 30, 25),
    );
  });

  it('should create and save a booking when there is no conflict', async () => {
    const useCase = new RegisterBookingUseCase(
      bookingRepo,
      customerRepo,
      barbershopServiceRepo,
    );

    const input = {
      id: 'b-id',
      barbershopId: 'shop-1',
      customerId: 'c-1',
      serviceId: 's-1',
      startAt: new Date('2025-12-24T10:00:00Z'),
    };

    const result = await useCase.execute(input, 'u-1');

    expect(bookingRepo.findManyByBarbershopIdBetween).toHaveBeenCalledWith(
      'shop-1',
      expect.any(Date),
      expect.any(Date),
    );
    expect(bookingRepo.save).toHaveBeenCalledTimes(1);
    const saved = bookingRepo.save.mock.calls[0][0];
    expect(saved).toBeInstanceOf(Booking);
    expect(result).toBe(saved);
  });

  it('should throw when there is a conflicting booking', async () => {
    // existing booking overlaps 10:15-10:45
    const existing = new Booking(
      'ex-1',
      'shop-1',
      'c-x',
      's-x',
      new Date('2025-12-24T10:15:00Z'),
      new Date('2025-12-24T10:45:00Z'),
    );

    bookingRepo.findManyByBarbershopIdBetween.mockResolvedValueOnce([existing]);

    const useCase = new RegisterBookingUseCase(
      bookingRepo,
      customerRepo,
      barbershopServiceRepo,
    );

    const input = {
      id: 'b-id',
      barbershopId: 'shop-1',
      customerId: 'c-1',
      serviceId: 's-1',
      startAt: new Date('2025-12-24T10:00:00Z'),
    };

    await expect(useCase.execute(input, 'u-1')).rejects.toThrow(
      'Booking time conflict',
    );

    expect(bookingRepo.save).not.toHaveBeenCalled();
  });

  it('should allow booking when existing booking is canceled', async () => {
    const existing = new Booking(
      'ex-1',
      'shop-1',
      'c-x',
      's-x',
      new Date('2025-12-24T10:15:00Z'),
      new Date('2025-12-24T10:45:00Z'),
    );
    existing.cancel();

    bookingRepo.findManyByBarbershopIdBetween.mockResolvedValueOnce([existing]);

    const useCase = new RegisterBookingUseCase(
      bookingRepo,
      customerRepo,
      barbershopServiceRepo,
    );

    const input = {
      id: 'b-id',
      barbershopId: 'shop-1',
      customerId: 'c-1',
      serviceId: 's-1',
      startAt: new Date('2025-12-24T10:00:00Z'),
    };

    const result = await useCase.execute(input, 'u-1');

    expect(bookingRepo.save).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Booking);
  });

  it('should throw when customer not found', async () => {
    customerRepo.findById.mockResolvedValueOnce(null);

    const useCase = new RegisterBookingUseCase(
      bookingRepo,
      customerRepo,
      barbershopServiceRepo,
    );

    const input = {
      id: 'b-id',
      barbershopId: 'shop-1',
      customerId: 'missing',
      serviceId: 's-1',
      startAt: new Date('2025-12-24T10:00:00Z'),
    };

    await expect(useCase.execute(input, 'u-1')).rejects.toThrow(
      'Customer not found',
    );

    expect(bookingRepo.save).not.toHaveBeenCalled();
  });

  it('should throw when barbershop service not found', async () => {
    barbershopServiceRepo.findById.mockResolvedValueOnce(null);

    const useCase = new RegisterBookingUseCase(
      bookingRepo,
      customerRepo,
      barbershopServiceRepo,
    );

    const input = {
      id: 'b-id',
      barbershopId: 'shop-1',
      customerId: 'c-1',
      serviceId: 'missing',
      startAt: new Date('2025-12-24T10:00:00Z'),
    };

    await expect(useCase.execute(input, 'u-1')).rejects.toThrow(
      'Barbershop service not found',
    );

    expect(bookingRepo.save).not.toHaveBeenCalled();
  });

  it('should throw when actor does not own customer', async () => {
    const useCase = new RegisterBookingUseCase(
      bookingRepo,
      customerRepo,
      barbershopServiceRepo,
    );

    const input = {
      id: 'b-id',
      barbershopId: 'shop-1',
      customerId: 'c-1',
      serviceId: 's-1',
      startAt: new Date('2025-12-24T10:00:00Z'),
    };

    await expect(useCase.execute(input, 'u-not-owner')).rejects.toThrow(
      'Not allowed to create booking for customer',
    );

    expect(bookingRepo.save).not.toHaveBeenCalled();
  });
});
