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
    };

    const services = await this.serviceRepo.findMany(filters);

    return { services };
  }
}
