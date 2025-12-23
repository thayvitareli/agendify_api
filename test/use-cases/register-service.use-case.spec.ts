import { IBarbershopRepository } from 'src/modules/barbershop/domain/repositories/barbershop.repository';
import { Barbershop } from 'src/modules/barbershop/domain/model/barbershop.model';
import { Address } from 'src/modules/barbershop/domain/value_objects/address.vo';
import { IBarbershopServiceRepository } from 'src/modules/barbershop-service/domain/repositories/barbershop-service.repository';
import { RegisterServiceUseCase } from 'src/modules/barbershop-service/use-cases/register-service.use-case';
import { BarbershopService } from 'src/modules/barbershop-service/domain/model/barbershop-service.model';

describe('RegisterServiceUseCase', () => {
  const barbershopRepo: jest.Mocked<IBarbershopRepository> = {
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
    barbershopRepo.findById.mockResolvedValue(
      new Barbershop(
        'b-id',
        'owner-id',
        '999999999',
        'Shop',
        new Address('Main', '1', 'City', 'ST', '00000'),
      ),
    );
    barbershopServiceRepo.save.mockResolvedValue();
  });

  it('should create and save a BarbershopService', async () => {
    const useCase = new RegisterServiceUseCase(
      barbershopRepo,
      barbershopServiceRepo,
    );

    const input = {
      id: 'service-id',
      barbershopId: 'b-id',
      name: 'Haircut',
      durationMinutes: 30,
      price: 25,
    };

    const result = await useCase.execute(input);

    expect(barbershopRepo.findById).toHaveBeenCalledWith('b-id');

    expect(barbershopServiceRepo.save).toHaveBeenCalledTimes(1);
    const saved = barbershopServiceRepo.save.mock.calls[0][0];
    expect(saved).toBeInstanceOf(BarbershopService);
    expect(saved.id).toBe('service-id');
    expect(saved.barbershopId).toBe('b-id');
    expect(saved.name).toBe('Haircut');
    expect(saved.durationMinutes).toBe(30);
    expect(saved.price).toBe(25);

    expect(result).toBeInstanceOf(BarbershopService);
    expect(result.id).toBe('service-id');
  });

  it('should throw when barbershop not found', async () => {
    barbershopRepo.findById.mockResolvedValueOnce(null);

    const useCase = new RegisterServiceUseCase(
      barbershopRepo,
      barbershopServiceRepo,
    );

    const input = {
      id: 'service-id',
      barbershopId: 'missing',
      name: 'Haircut',
      durationMinutes: 30,
      price: 25,
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Barbershop not found',
    );

    expect(barbershopServiceRepo.save).not.toHaveBeenCalled();
  });

  it('should throw when duration is invalid', async () => {
    const useCase = new RegisterServiceUseCase(
      barbershopRepo,
      barbershopServiceRepo,
    );

    const input = {
      id: 'service-id',
      barbershopId: 'b-id',
      name: 'Haircut',
      durationMinutes: 0,
      price: 25,
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Duration must be greater than 0.',
    );

    expect(barbershopServiceRepo.save).not.toHaveBeenCalled();
  });

  it('should throw when price is negative', async () => {
    const useCase = new RegisterServiceUseCase(
      barbershopRepo,
      barbershopServiceRepo,
    );

    const input = {
      id: 'service-id',
      barbershopId: 'b-id',
      name: 'Haircut',
      durationMinutes: 30,
      price: -5,
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Price cannot be negative.',
    );

    expect(barbershopServiceRepo.save).not.toHaveBeenCalled();
  });
});
