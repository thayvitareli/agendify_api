import { BarbershopService } from '../model/barbershop-service.model';

export interface BarbershopServiceSearchFilters {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  barbershopId?: string;
  active?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'durationMinutes';
  sortOrder?: 'ASC' | 'DESC';
}

export interface IBarbershopServiceRepository {
  save(service: BarbershopService): Promise<BarbershopService | null>;
  findById(id: string): Promise<BarbershopService | null>;
  findByBarbershopId(barbershopId: string): Promise<BarbershopService[]>;
  findMany(
    filters: BarbershopServiceSearchFilters,
  ): Promise<{ services: BarbershopService[]; total: number }>;
}
