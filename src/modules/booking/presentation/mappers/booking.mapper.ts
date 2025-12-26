import { Booking } from '../../domain/model/booking.model';
import { BookingEntity } from '../../infrastructure/entity/booking.entity';

export class BookingMapper {
  static toDomain(entity: BookingEntity): Booking {
    if (!entity) return null as any;

    return new Booking(
      entity.id,
      entity.barbershopId,
      entity.customerId,
      entity.serviceId,
      entity.startAt,
      entity.endAt,
      entity.status,
      entity.canceledAt,
    );
  }

  static toPersistence(domain: Booking): BookingEntity {
    const entity = new BookingEntity();
    entity.id = domain.id;
    entity.barbershopId = domain.barbershopId;
    entity.customerId = domain.customerId;
    entity.serviceId = domain.serviceId;
    entity.startAt = domain.startAt;
    entity.endAt = domain.endAt;
    entity.status = domain.status;
    entity.canceledAt = domain.canceledAt;
    return entity;
  }
}
