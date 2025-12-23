import { Booking } from 'src/modules/booking/domain/model/booking.model';
import { IBookingRepository } from 'src/modules/booking/domain/repositories/booking.repository';
import { CancelBookingUseCase } from 'src/modules/booking/use-cases/cancel-booking.use-case';

describe('RegisterBookingUseCase', () => {
  const bookingRepo: jest.Mocked<IBookingRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByCustomerId: jest.fn(),
    findByBarbershopId: jest.fn(),
    findByBarbershopIdBetween: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    bookingRepo.findById.mockResolvedValue(null);
    bookingRepo.save.mockResolvedValue();
  });

  it('should throw an error when booking is not found', async () => {
    const useCase = new CancelBookingUseCase(bookingRepo);

    bookingRepo.findById.mockResolvedValueOnce(null);

    const input = {
      id: 'b-id',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Booking not found');
  });

  it('should cancel a booking when found', async () => {
    const existingBooking = new Booking(
      'b-id',
      'shop-1',
      'c-1',
      's-1',
      new Date('2025-12-24T10:00:00Z'),
      new Date('2025-12-24T10:30:00Z'),
    );

    const useCase = new CancelBookingUseCase(bookingRepo);

    bookingRepo.findById.mockResolvedValueOnce(existingBooking);

    const input = {
      id: 'b-id',
    };

    const result = await useCase.execute(input);

    expect(bookingRepo.save).toHaveBeenCalledWith(existingBooking);
    expect(result.status).toBe('CANCELED');
    expect(result.canceledAt).toBeInstanceOf(Date);
  });

  it('should throw an error when try cancel a booking that is already canceled', async () => {
    const existingBooking = new Booking(
      'b-id',
      'shop-1',
      'c-1',
      's-1',
      new Date('2025-12-24T10:00:00Z'),
      new Date('2025-12-24T10:30:00Z'),
      'CANCELED',
      new Date('2025-12-23T13:00:00Z'),
    );

    const useCase = new CancelBookingUseCase(bookingRepo);

    bookingRepo.findById.mockResolvedValueOnce(existingBooking);

    const input = {
      id: 'b-id',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Booking already canceled',
    );
  });
});
