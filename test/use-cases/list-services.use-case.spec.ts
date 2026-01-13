import { ListServicesUseCase } from 'src/modules/barbershop-service/use-cases/list-services.use-case';
import { IBarbershopServiceRepository } from 'src/modules/barbershop-service/domain/repositories/barbershop-service.repository';
import { BarbershopService } from 'src/modules/barbershop-service/domain/model/barbershop-service.model';

describe('ListServicesUseCase', () => {
  const serviceRepo: jest.Mocked<IBarbershopServiceRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByBarbershopId: jest.fn(),
    findMany: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    serviceRepo.findMany.mockResolvedValue({
      services: [new BarbershopService('s-1', 'shop-1', 'Corte', 30, 50, true)],
      total: 1,
    });
  });

  it('should throw when minPrice is greater than maxPrice', async () => {
    const useCase = new ListServicesUseCase(serviceRepo);

    await expect(
      useCase.execute({ minPrice: 100, maxPrice: 10 }),
    ).rejects.toThrow('Invalid price range');
  });

  it('should search active services with provided filters', async () => {
    const useCase = new ListServicesUseCase(serviceRepo);

    const result = await useCase.execute({
      name: 'cor',
      minPrice: 10,
      maxPrice: 100,
    });

    expect(serviceRepo.findMany).toHaveBeenCalledWith({
      name: 'cor',
      minPrice: 10,
      maxPrice: 100,
      active: true,
      page: 1,
      limit: 20,
      sortBy: undefined,
      sortOrder: undefined,
    });
    expect(result.services).toHaveLength(1);
    expect(result.services[0]).toBeInstanceOf(BarbershopService);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('should allow filtering by barbershopId', async () => {
    const useCase = new ListServicesUseCase(serviceRepo);

    await useCase.execute({ barbershopId: 'shop-1' });

    expect(serviceRepo.findMany).toHaveBeenCalledWith({
      name: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      barbershopId: 'shop-1',
      active: true,
      page: 1,
      limit: 20,
      sortBy: undefined,
      sortOrder: undefined,
    });
  });

  it('should support pagination and sorting', async () => {
    const useCase = new ListServicesUseCase(serviceRepo);

    await useCase.execute({ page: 2, limit: 5, sortBy: 'price', sortOrder: 'DESC' });

    expect(serviceRepo.findMany).toHaveBeenCalledWith({
      name: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      barbershopId: undefined,
      active: true,
      page: 2,
      limit: 5,
      sortBy: 'price',
      sortOrder: 'DESC',
    });
  });
});
