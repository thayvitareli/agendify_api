import { BarbershopService } from '../../domain/model/barbershop-service.model';

export interface BarbershopServiceHttp {
  id: string;
  barbershopId: string;
  name: string;
  durationInMinutes: number;
  price: number;
  active: boolean;
}

export class BarbershopServicePresenter {
  static toHttp(service: BarbershopService): BarbershopServiceHttp {
    return {
      id: service.id,
      barbershopId: service.barbershopId,
      name: service.name,
      durationInMinutes: service.durationMinutes,
      price: service.price,
      active: service.active,
    };
  }
}
