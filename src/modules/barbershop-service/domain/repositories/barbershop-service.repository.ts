import { BarbershopService } from '../model/barbershop-service.model';

export interface IBarbershopServiceRepository {
  save(service: BarbershopService): Promise<BarbershopService | null>;
  findById(id: string): Promise<BarbershopService | null>;
  findByBarbershopId(barbershopId: string): Promise<BarbershopService[]>;
}
