import { Barbershop } from '../../domain/model/barbershop.model';
import { Address } from '../../domain/value_objects/address.vo';
import { BarbershopEntity } from '../../infrastructure/entity/barbershop.entity';

export class BarbershopMapper {
  static toDomain(entity: BarbershopEntity): Barbershop {
    if (!entity) return null as any;

    return new Barbershop(
      entity.id,
      entity.ownerUserId,
      entity.phone,
      entity.name,
      new Address(
        entity.street,
        entity.number,
        entity.city,
        entity.state,
        entity.zipCode,
      ),
    );
  }

  static toPersistence(domain: Barbershop): BarbershopEntity {
    const entity = new BarbershopEntity();
    entity.id = domain.id;
    entity.phone = domain.phone ?? '';
    entity.name = domain.name;
    entity.number = domain.address.number;
    entity.city = domain.address.city;
    entity.state = domain.address.state;
    entity.street = domain.address.street;
    entity.zipCode = domain.address.zipCode;
    entity.ownerUserId = domain.ownerUserId;
    return entity;
  }
}
