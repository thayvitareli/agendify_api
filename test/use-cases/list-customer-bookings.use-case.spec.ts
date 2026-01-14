import { Booking } from 'src/modules/booking/domain/model/booking.model';
import { IBookingRepository } from 'src/modules/booking/domain/repositories/booking.repository';
import { ListCustomerBookingsUseCase } from 'src/modules/booking/use-cases/list-customer-bookings.use-case';
import { Customer } from 'src/modules/customer/domain/model/customer.model';
import { ICustomerRepository } from 'src/modules/customer/domain/repositories/customer.repository';

describe('ListCustomerBookingsUseCase', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    customerRepo.findByUserId.mockResolvedValue(
      new Customer('customer-1', 'user-1', '99999999'),
    );
    bookingRepo.findManyByCustomerId.mockResolvedValue({
      bookings: [
        new Booking(
          'booking-1',
          'shop-1',
          'customer-1',
          'service-1',
          new Date('2025-12-24T10:00:00Z'),
          new Date('2025-12-24T10:30:00Z'),
        ),
      ],
      total: 1,
    });
  });

  it('should throw NotFoundException when customer is not found', async () => {
    customerRepo.findByUserId.mockResolvedValueOnce(null);

    const useCase = new ListCustomerBookingsUseCase(bookingRepo, customerRepo);

    await expect(useCase.execute('user-1')).rejects.toThrow('Customer not found');
  });

  it('should throw ForbiddenException when actor does not own customer', async () => {
    customerRepo.findByUserId.mockResolvedValueOnce(
      new Customer('customer-1', 'user-other', '99999999'),
    );

    const useCase = new ListCustomerBookingsUseCase(bookingRepo, customerRepo);

    await expect(useCase.execute('user-1')).rejects.toThrow(
      'Not allowed to list bookings for this customer',
    );
  });

  it('should list customer bookings', async () => {
    const useCase = new ListCustomerBookingsUseCase(bookingRepo, customerRepo);

    const result = await useCase.execute('user-1');

    expect(customerRepo.findByUserId).toHaveBeenCalledWith('user-1');
    expect(bookingRepo.findManyByCustomerId).toHaveBeenCalledWith(
      'customer-1',
      { page: 1, limit: 20, sortBy: 'startAt', sortOrder: 'ASC' },
    );
    expect(result.bookings).toHaveLength(1);
    expect(result.bookings[0]).toBeInstanceOf(Booking);
    expect(result.total).toBe(1);
  });
});
