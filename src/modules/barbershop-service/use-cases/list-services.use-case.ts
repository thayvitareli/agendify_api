import { Inject } from '@nestjs/common';
import type {
  BarbershopServiceSearchFilters,
  IBarbershopServiceRepository,
} from '../domain/repositories/barbershop-service.repository';

export interface ListServicesInput {
  name?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  barbershopId?: string;
  page?: number | string;
  limit?: number | string;
  sortBy?: 'name' | 'price' | 'durationMinutes';
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}

export class ListServicesUseCase {
  constructor(
    @Inject('IBarbershopServiceRepository')
    private readonly serviceRepo: IBarbershopServiceRepository,
  ) {}

  async execute(input: ListServicesInput) {
    const minPrice =
      input.minPrice == null || input.minPrice === ''
        ? undefined
        : Number(input.minPrice);
    const maxPrice =
      input.maxPrice == null || input.maxPrice === ''
        ? undefined
        : Number(input.maxPrice);

    if (minPrice != null && !Number.isFinite(minPrice)) {
      throw new Error('Invalid minPrice');
    }
    if (maxPrice != null && !Number.isFinite(maxPrice)) {
      throw new Error('Invalid maxPrice');
    }

    const page =
      input.page == null || input.page === '' ? 1 : Number(input.page);
    const limit =
      input.limit == null || input.limit === '' ? 20 : Number(input.limit);

    if (!Number.isInteger(page) || page <= 0) {
      throw new Error('Invalid page');
    }
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error('Invalid limit');
    }

    if (
      minPrice != null &&
      maxPrice != null &&
      minPrice > maxPrice
    ) {
      throw new Error('Invalid price range');
    }

    const filters: BarbershopServiceSearchFilters = {
      name: input.name,
      minPrice,
      maxPrice,
      barbershopId: input.barbershopId,
      active: true,
      page,
      limit,
      sortBy: input.sortBy,
      sortOrder:
        input.sortOrder?.toUpperCase() === 'DESC'
          ? 'DESC'
          : input.sortOrder?.toUpperCase() === 'ASC'
            ? 'ASC'
            : undefined,
    };

    const { services, total } = await this.serviceRepo.findMany(filters);

    return { services, total, page, limit };
  }
}
