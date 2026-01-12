import { BarbershopService } from '../model/barbershop-service.model';

export interface BarbershopServiceSearchFilters {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  barbershopId?: string;
  active?: boolean;
}

export interface IBarbershopServiceRepository {
  save(service: BarbershopService): Promise<BarbershopService | null>;
  findById(id: string): Promise<BarbershopService | null>;
  findByBarbershopId(barbershopId: string): Promise<BarbershopService[]>;
  findMany(
    filters: BarbershopServiceSearchFilters,
  ): Promise<BarbershopService[]>;
}
