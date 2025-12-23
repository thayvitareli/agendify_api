import { BarbershopService } from '../model/barbershop-service.model';

export interface IBarbershopServiceRepository {
  save(service: BarbershopService): Promise<void>;
  findById(id: string): Promise<BarbershopService | null>;
  findByBarbershopId(barbershopId: string): Promise<BarbershopService[]>;
}
