import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { BarbershopService } from '../../domain/model/barbershop-service.model';
import { BarbershopServiceEntity } from '../../infrastructure/entity/barbershop-service.entity';

export class BarbershopServiceMapper {
  static toDomain(entity: BarbershopServiceEntity): BarbershopService {
    if (!entity) return null as any;

    return new BarbershopService(
      entity.id,
      entity.barbershopId,
      entity.name,
      entity.durationMinutes,
      entity.price,
      entity.active,
    );
  }

  static toPersistence(domain: BarbershopService): BarbershopServiceEntity {
    const entity = new BarbershopServiceEntity();
    entity.id = domain.id;
    entity.barbershopId = domain.barbershopId;
    entity.name = domain.name;
    entity.durationMinutes = domain.durationMinutes;
    entity.price = domain.price;
    entity.active = domain.active;
    return entity;
  }
}
